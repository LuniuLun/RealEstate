package apidemo.services;

import ai.onnxruntime.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
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
  private static final float SAFE_THRESHOLD = 0.8f;

  private OrtEnvironment environment;
  private OrtSession session;
  private String inputName;

  @Value("${model.volume.folder:/resources/}")
  private String modelFolder;
  @Value("${model.nsfw.url}")
  private String modelUrl;
  @Value("${model.nsfw.filename:image_classifier_model.onnx}")
  private String modelFilename;

  @PostConstruct
  public void init() throws OrtException, IOException {
    try {
      environment = OrtEnvironment.getEnvironment();

      // Build đường dẫn model file local dựa trên folder + filename
      if (!modelFolder.endsWith("/")) {
        modelFolder += "/";
      }
      String modelLocalPath = modelFolder + modelFilename;
      File modelFile = new File(modelLocalPath);

      // Nếu chưa có model thì tải về
      if (!modelFile.exists()) {
        logger.info("Model file not found locally, downloading from: {}", modelUrl);

        // Tạo thư mục chứa model nếu chưa tồn tại
        modelFile.getParentFile().mkdirs();

        // Tải model từ URL và lưu vào thư mục mounted
        try (InputStream in = new URL(modelUrl).openStream()) {
          Files.copy(in, modelFile.toPath());
        }

        logger.info("Model downloaded to: {}", modelFile.getAbsolutePath());
      } else {
        logger.info("Model file found locally at: {}", modelFile.getAbsolutePath());
      }

      // Load model từ file local
      byte[] modelBytes = Files.readAllBytes(modelFile.toPath());

      OrtSession.SessionOptions sessionOptions = new OrtSession.SessionOptions();
      session = environment.createSession(modelBytes, sessionOptions);

      inputName = session.getInputNames().iterator().next();

      logger.info("NSFW classifier model loaded successfully");

    } catch (Exception e) {
      logger.error("Failed to load NSFW classifier model", e);
      throw e;
    }
  }

  private ImageClassificationResult classifyBufferedImage(BufferedImage image) throws OrtException {
    BufferedImage resizedImage = new BufferedImage(IMAGE_WIDTH, IMAGE_HEIGHT, BufferedImage.TYPE_INT_RGB);
    resizedImage.getGraphics().drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT, null);

    float[][][][] input = new float[1][IMAGE_HEIGHT][IMAGE_WIDTH][3];

    for (int y = 0; y < IMAGE_HEIGHT; y++) {
      for (int x = 0; x < IMAGE_WIDTH; x++) {
        int rgb = resizedImage.getRGB(x, y);
        input[0][y][x][0] = ((rgb >> 16) & 0xFF) / 255.0f; // R
        input[0][y][x][1] = ((rgb >> 8) & 0xFF) / 255.0f; // G
        input[0][y][x][2] = (rgb & 0xFF) / 255.0f; // B
      }
    }

    OnnxTensor tensor = OnnxTensor.createTensor(environment, input);

    OrtSession.Result result = session.run(Collections.singletonMap(inputName, tensor));

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
