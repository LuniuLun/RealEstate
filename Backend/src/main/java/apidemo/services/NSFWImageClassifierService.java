package apidemo.services;

import ai.onnxruntime.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import apidemo.models.ImageClassificationResult;

@Service
public class NSFWImageClassifierService {
  private static final Logger logger = LoggerFactory.getLogger(NSFWImageClassifierService.class);
  private static final int IMAGE_WIDTH = 256;
  private static final int IMAGE_HEIGHT = 256;

  private static final String MODEL_NAME = "classifier_model.onnx";
  private static final float SAFE_THRESHOLD = 0.8f;

  private OrtEnvironment environment;
  private OrtSession session;
  private String inputName;

  @PostConstruct
  public void init() throws OrtException, IOException {
    try {
      environment = OrtEnvironment.getEnvironment();

      // Direct file loading without Spring properties
      File modelFile;
      try {
        modelFile = new File(getClass().getClassLoader().getResource(MODEL_NAME).toURI());
        logger.info("Loading model from: {}", modelFile.getAbsolutePath());
      } catch (URISyntaxException | NullPointerException e) {
        logger.error("Could not find model file: {}", MODEL_NAME, e);
        throw new IOException("Model file not found", e);
      }

      // Read the model bytes
      byte[] modelBytes = Files.readAllBytes(modelFile.toPath());

      OrtSession.SessionOptions sessionOptions = new OrtSession.SessionOptions();
      session = environment.createSession(modelBytes, sessionOptions);

      inputName = session.getInputNames().iterator().next();

      logger.info("NSFW classifier model loaded successfully from: {}", modelFile.getAbsolutePath());
    } catch (Exception e) {
      logger.error("Failed to load NSFW classifier model", e);
      throw e;
    }
  }

  private ImageClassificationResult classifyBufferedImage(BufferedImage image) throws OrtException {
    // Resize image to required dimensions
    BufferedImage resizedImage = new BufferedImage(IMAGE_WIDTH, IMAGE_HEIGHT, BufferedImage.TYPE_INT_RGB);
    resizedImage.getGraphics().drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT, null);

    // Preprocess image - normalize to [0, 1]
    float[][][][] input = new float[1][IMAGE_HEIGHT][IMAGE_WIDTH][3];

    for (int y = 0; y < IMAGE_HEIGHT; y++) {
      for (int x = 0; x < IMAGE_WIDTH; x++) {
        int rgb = resizedImage.getRGB(x, y);
        input[0][y][x][0] = ((rgb >> 16) & 0xFF) / 255.0f; // R
        input[0][y][x][1] = ((rgb >> 8) & 0xFF) / 255.0f; // G
        input[0][y][x][2] = (rgb & 0xFF) / 255.0f; // B
      }
    }

    // Create input tensor
    OnnxTensor tensor = OnnxTensor.createTensor(environment, input);

    // Run inference
    OrtSession.Result result = session.run(Collections.singletonMap(inputName, tensor));

    // Process output
    float[][] output = (float[][]) result.get(0).getValue();
    float[] probabilities = output[0];

    float safeScore = probabilities[1];
    float unsafeScore = probabilities[0];
    boolean isSafe = safeScore >= SAFE_THRESHOLD;

    ImageClassificationResult classificationResult = new ImageClassificationResult(
        safeScore, unsafeScore, isSafe);

    tensor.close();
    result.close();

    return classificationResult;
  }

  public List<ImageClassificationResult> classify(MultipartFile[] files) {
    List<ImageClassificationResult> results = new ArrayList<>();

    for (MultipartFile file : files) {
      try {
        BufferedImage image = ImageIO.read(file.getInputStream());
        if (image == null) {
          results.add(new ImageClassificationResult(0.0f, 1.0f, false));
          continue;
        }

        ImageClassificationResult result = classifyBufferedImage(image);
        results.add(result);
      } catch (Exception e) {
        results.add(new ImageClassificationResult(0.0f, 1.0f, false));
      }
    }

    return results;
  }
}