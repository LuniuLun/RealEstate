package apidemo.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.*;

import org.jpmml.evaluator.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PropertyMLService {
  private static final Logger logger = LoggerFactory.getLogger(PropertyMLService.class);
  private static final String SCALER_FILE_PATH = "scaler_params.csv";
  private static final Set<String> REQUIRED_FEATURES = Set.of(
      "Longitude", "Latitude", "Area (m²)", "Floors", "Rooms", "Toilets", "Length (m)");

  private final Evaluator modelEvaluator;
  private final Map<String, double[]> scalerParams;

  public PropertyMLService() {
    try {
      logger.info("Initializing PropertyMLService...");

      // Load PMML model
      File modelFile = new File(getClass().getClassLoader().getResource("random_forest_model.pmml").toURI());
      logger.debug("Loading PMML model from file: {}", modelFile.getAbsolutePath());

      this.modelEvaluator = new LoadingModelEvaluatorBuilder().load(modelFile).build();

      modelEvaluator.verify(); // Kiểm tra model

      logger.info("Model evaluator initialized successfully.");
      logger.debug("Input Fields: {}", modelEvaluator.getInputFields());
      logger.debug("Target Fields: {}", modelEvaluator.getTargetFields());
      logger.debug("Output Fields: {}", modelEvaluator.getOutputFields());

      // Load scaler parameters
      this.scalerParams = readScalerParams();
      logger.debug("Scaler parameters loaded.");

    } catch (Exception e) {
      logger.error("Failed to initialize PropertyMLService", e);
      throw new RuntimeException("Initialization failed", e);
    }
  }

  public double estimatePropertyPrice(Map<String, Double> propertyFeatures) {
    validateInputFeatures(propertyFeatures);

    Map<String, Double> transformedFeatures = new HashMap<>(propertyFeatures);

    Set<String> sqrtColumns = Set.of("Longitude", "Latitude", "Area (m²)", "Floors", "Rooms", "Toilets");
    for (String feature : sqrtColumns) {
      if (transformedFeatures.containsKey(feature)) {
        transformedFeatures.put(feature, Math.sqrt(transformedFeatures.get(feature)));
      }
    }

    if (transformedFeatures.containsKey("Length (m)")) {
      double[] stdParams = scalerParams.get("std");
      double[] meanParams = scalerParams.get("mean");
      if (stdParams != null && meanParams != null) {
        double normalizedLength = (transformedFeatures.get("Length (m)") - meanParams[1]) / stdParams[1];
        transformedFeatures.put("Length (m)", normalizedLength);
      }
    }

    Map<String, ?> evaluationResult = modelEvaluator.evaluate(transformedFeatures);
    evaluationResult = EvaluatorUtil.decodeAll(evaluationResult);
    logger.debug("Evaluation Result: {}", evaluationResult);
    Object priceResult = evaluationResult.get("y");
    logger.debug("type of priceResult: {}", priceResult.getClass().getName());

    double normalizedPrice;
    if (priceResult instanceof Map) {
      @SuppressWarnings("unchecked")
      Map<String, ?> resultMap = (Map<String, ?>) priceResult;
      Object result = resultMap.get("result");
      if (result == null) {
        logger.error("No price prediction returned.");
        throw new IllegalStateException("No price prediction returned");
      }
      normalizedPrice = ((Number) result).doubleValue();
    } else if (priceResult instanceof Number) {
      normalizedPrice = ((Number) priceResult).doubleValue();
    } else {
      logger.error("Unexpected result type: {}", priceResult.getClass().getName());
      throw new IllegalStateException("Unexpected result type: " + priceResult.getClass().getName());
    }

    logger.debug("Scaler Params Keys: {}", scalerParams.keySet());
    double[] stdParams = scalerParams.get("std");
    double[] meanParams = scalerParams.get("mean");
    if (stdParams != null && meanParams != null) {
      return normalizedPrice * stdParams[0] + meanParams[0];
    }
    return normalizedPrice;
  }

  private void validateInputFeatures(Map<String, Double> features) {
    REQUIRED_FEATURES.forEach(feature -> {
      if (!features.containsKey(feature)) {
        throw new IllegalArgumentException("Missing required feature: " + feature);
      }
    });
  }

  private Map<String, double[]> readScalerParams() throws Exception {
    Map<String, double[]> params = new HashMap<>();
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
        Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(SCALER_FILE_PATH))))) {
      reader.readLine();
      String line;
      while ((line = reader.readLine()) != null) {
        String[] values = line.split(",");
        if (values.length == 3) {
          params.put(values[0], new double[] { Double.parseDouble(values[1]), Double.parseDouble(values[2]) });
        }
      }
    }
    return params;
  }
}
