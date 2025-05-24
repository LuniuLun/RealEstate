package apidemo.services;

import ai.onnxruntime.*;
import apidemo.models.ToxicityResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ToxicContentDetectionService {

  private static final Logger logger = LoggerFactory.getLogger(ToxicContentDetectionService.class);
  private static final String MODEL_NAME = "toxicity_detection_model.onnx";
  private static final String TOKENIZER_NAME = "tokenizer.json";

  private OrtEnvironment environment;
  private OrtSession session;
  private Map<String, Integer> vocab;
  private List<String> vocabList;
  private List<String> merges;
  private int maxLength = 512;

  // Special tokens for BPE/SentencePiece tokenizer
  private int padTokenId = 0; // <pad>
  private int eosTokenId = 1; // </s>
  private int unkTokenId = 2; // <unk>

  // Metaspace replacement character
  private static final String METASPACE_CHAR = "▁";

  // Pattern for multiple spaces
  private static final Pattern MULTIPLE_SPACES = Pattern.compile(" {2,}");

  @PostConstruct
  public void init() throws OrtException, IOException {
    try {
      environment = OrtEnvironment.getEnvironment();

      // Load model
      File modelFile = new File(getClass().getClassLoader().getResource(MODEL_NAME).toURI());
      byte[] modelBytes = Files.readAllBytes(modelFile.toPath());
      session = environment.createSession(modelBytes, new OrtSession.SessionOptions());

      // Load BPE tokenizer
      loadBPETokenizer();

    } catch (URISyntaxException | NullPointerException e) {
      throw new IOException("Required file not found", e);
    } catch (Exception e) {
      throw e;
    }
  }

  private void loadBPETokenizer() throws IOException {
    try (InputStream tokenizerStream = getClass().getClassLoader().getResourceAsStream(TOKENIZER_NAME)) {
      if (tokenizerStream == null) {
        throw new IOException("Tokenizer file not found in resources: " + TOKENIZER_NAME);
      }

      ObjectMapper mapper = new ObjectMapper();
      JsonNode tokenizerJson = mapper.readTree(tokenizerStream);

      // Extract vocabulary from BPE model
      vocab = new HashMap<>();
      vocabList = new ArrayList<>();
      JsonNode vocabNode = tokenizerJson.get("model").get("vocab");

      if (vocabNode != null && vocabNode.isObject()) {
        // Collect all tokens and sort by ID
        List<Map.Entry<String, Integer>> entries = new ArrayList<>();
        Iterator<Map.Entry<String, JsonNode>> fields = vocabNode.fields();
        while (fields.hasNext()) {
          Map.Entry<String, JsonNode> entry = fields.next();
          int tokenId = entry.getValue().asInt();
          vocab.put(entry.getKey(), tokenId);
          entries.add(new AbstractMap.SimpleEntry<>(entry.getKey(), tokenId));
        }

        // Sort by token ID and create vocab list
        entries.sort(Map.Entry.comparingByValue());
        vocabList = new ArrayList<>(Collections.nCopies(entries.size(), ""));
        for (Map.Entry<String, Integer> entry : entries) {
          if (entry.getValue() < vocabList.size()) {
            vocabList.set(entry.getValue(), entry.getKey());
          }
        }

        logger.info("Loaded BPE vocabulary with {} tokens", vocab.size());
      } else {
        throw new IOException("Cannot extract vocabulary from tokenizer.json");
      }

      merges = new ArrayList<>();
      JsonNode mergesNode = tokenizerJson.get("model").get("merges");
      if (mergesNode != null && mergesNode.isArray()) {
        for (JsonNode mergeNode : mergesNode) {
          merges.add(mergeNode.asText());
        }
      }

      padTokenId = vocab.getOrDefault("<pad>", 0);
      eosTokenId = vocab.getOrDefault("</s>", 1);
      unkTokenId = vocab.getOrDefault("<unk>", 2);

      logger.info("BPE Tokenizer loaded successfully. PAD: {}, EOS: {}, UNK: {}",
          padTokenId, eosTokenId, unkTokenId);

    } catch (Exception e) {
      throw new IOException("Failed to load BPE tokenizer", e);
    }
  }

  private long[] encodeText(String text) {
    List<Integer> tokenIds = new ArrayList<>();

    // Step 1: Normalize text (replace multiple spaces with single space)
    String normalizedText = MULTIPLE_SPACES.matcher(text.trim()).replaceAll(" ");

    // Step 2: Metaspace preprocessing - add prefix space and replace spaces with ▁
    String metaspaceText = METASPACE_CHAR + normalizedText.replace(" ", METASPACE_CHAR);

    logger.debug("Original text: '{}'", text);
    logger.debug("Metaspace text: '{}'", metaspaceText);

    // Step 3: Apply BPE tokenization
    List<String> tokens = bpeTokenize(metaspaceText);

    logger.debug("BPE tokens: {}", tokens);

    // Step 4: Convert tokens to IDs
    for (String token : tokens) {
      Integer tokenId = vocab.get(token);
      if (tokenId != null) {
        tokenIds.add(tokenId);
      } else {
        tokenIds.add(unkTokenId);
        logger.debug("Unknown token: '{}'", token);
      }
    }

    // Step 5: Add EOS token (</s>) as per post-processor
    tokenIds.add(eosTokenId);

    // Step 6: Pad or truncate to maxLength
    while (tokenIds.size() < maxLength) {
      tokenIds.add(padTokenId);
    }
    if (tokenIds.size() > maxLength) {
      tokenIds = tokenIds.subList(0, maxLength - 1);
      tokenIds.add(eosTokenId); // Ensure EOS token at the end
    }

    return tokenIds.stream().mapToLong(Integer::intValue).toArray();
  }

  private List<String> bpeTokenize(String text) {
    // Start with character-level tokens
    List<String> tokens = new ArrayList<>();
    for (char c : text.toCharArray()) {
      tokens.add(String.valueOf(c));
    }

    // Apply BPE merges
    for (String merge : merges) {
      String[] parts = merge.split(" ");
      if (parts.length == 2) {
        String first = parts[0];
        String second = parts[1];
        String merged = first + second;

        // Find and replace consecutive pairs
        for (int i = 0; i < tokens.size() - 1; i++) {
          if (tokens.get(i).equals(first) && tokens.get(i + 1).equals(second)) {
            tokens.set(i, merged);
            tokens.remove(i + 1);
            i--; // Check the same position again
          }
        }
      }
    }

    // Filter out tokens that are not in vocabulary and handle unknowns
    List<String> finalTokens = new ArrayList<>();
    for (String token : tokens) {
      if (vocab.containsKey(token)) {
        finalTokens.add(token);
      } else {
        // Try to find best matching substrings in vocab
        List<String> subTokens = handleUnknownToken(token);
        finalTokens.addAll(subTokens);
      }
    }

    return finalTokens;
  }

  private List<String> handleUnknownToken(String token) {
    List<String> result = new ArrayList<>();

    // Try to split unknown token into known parts
    int start = 0;
    while (start < token.length()) {
      String longestMatch = null;
      int longestLength = 0;

      // Find longest matching substring starting from current position
      for (int end = start + 1; end <= token.length(); end++) {
        String substr = token.substring(start, end);
        if (vocab.containsKey(substr) && substr.length() > longestLength) {
          longestMatch = substr;
          longestLength = substr.length();
        }
      }

      if (longestMatch != null) {
        result.add(longestMatch);
        start += longestLength;
      } else {
        // If no match found, add character as unknown or use UNK token
        String charStr = String.valueOf(token.charAt(start));
        if (vocab.containsKey(charStr)) {
          result.add(charStr);
        } else {
          result.add(vocabList.get(unkTokenId)); // Add <unk> token
        }
        start++;
      }
    }

    return result;
  }

  public ToxicityResponse detectToxicity(String text) throws OrtException {
    logger.info("Detecting toxicity for input text: {}", text);

    long[] inputIds = encodeText(text);
    long[] attentionMask = new long[inputIds.length];

    // Create attention mask (1 for real tokens, 0 for padding)
    for (int i = 0; i < inputIds.length; i++) {
      attentionMask[i] = inputIds[i] != padTokenId ? 1L : 0L;
    }

    // Debug logging
    logger.debug("Input IDs length: {}", inputIds.length);
    logger.debug("First 20 tokens: {}", Arrays.toString(Arrays.copyOf(inputIds, Math.min(20, inputIds.length))));

    OnnxTensor inputIdsTensor = OnnxTensor.createTensor(environment, new long[][] { inputIds });
    OnnxTensor attentionMaskTensor = OnnxTensor.createTensor(environment, new long[][] { attentionMask });

    Map<String, OnnxTensor> inputs = new HashMap<>();
    inputs.put("input_ids", inputIdsTensor);
    inputs.put("attention_mask", attentionMaskTensor);

    try (OrtSession.Result result = session.run(inputs)) {
      float[][] logits = (float[][]) result.get(0).getValue();
      float[] probs = softmax(logits[0]);

      // Debug logging
      logger.debug("Raw logits: {}", Arrays.toString(logits[0]));
      logger.debug("Probabilities: [NON-TOXIC: {}, TOXIC: {}]", probs[0], probs[1]);

      boolean isToxic = probs[1] > probs[0];
      double toxicScore = probs[1];
      double nonToxicScore = probs[0];
      ToxicityResponse.ToxicityLabel label = isToxic
          ? ToxicityResponse.ToxicityLabel.TOXIC
          : ToxicityResponse.ToxicityLabel.NON_TOXIC;

      logger.info("Prediction: {} with score: {}", label, isToxic ? toxicScore : nonToxicScore);
      return new ToxicityResponse(isToxic, toxicScore, nonToxicScore, label);

    } finally {
      inputIdsTensor.close();
      attentionMaskTensor.close();
    }
  }

  private float[] softmax(float[] logits) {
    float max = Float.NEGATIVE_INFINITY;
    for (float val : logits) {
      if (val > max)
        max = val;
    }

    double sum = 0.0;
    float[] exps = new float[logits.length];
    for (int i = 0; i < logits.length; i++) {
      exps[i] = (float) Math.exp(logits[i] - max);
      sum += exps[i];
    }

    for (int i = 0; i < exps.length; i++) {
      exps[i] /= sum;
    }

    return exps;
  }
}