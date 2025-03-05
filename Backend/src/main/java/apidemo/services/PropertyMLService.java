package apidemo.services;

import java.io.File;
import java.io.FileInputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import apidemo.utils.SquareScaler;
import apidemo.utils.ZScoreScaler;

import org.dmg.pmml.Model;
import org.dmg.pmml.PMML;
import org.jpmml.evaluator.ModelEvaluator;
import org.jpmml.evaluator.ModelEvaluatorFactory;
import org.jpmml.evaluator.Evaluator;
import org.jpmml.model.PMMLUtil;

import apidemo.utils.DataTransformer;

public class PropertyMLService {
  private static final Logger logger = LoggerFactory.getLogger(PropertyMLService.class);

  private static final Set<String> REQUIRED_FEATURES = Set.of(
      "Longitude", "Latitude", "Area (m²)",
      "Floors", "Rooms", "Toilets", "Length (m)");

  private final ZScoreScaler zScoreScaler;
  private final SquareScaler squareScaler;
  private final ModelEvaluator<?> modelEvaluator;
  private final DataTransformer dataTransformer;

  public PropertyMLService() {
    this.zScoreScaler = new ZScoreScaler();
    this.squareScaler = new SquareScaler();
    this.dataTransformer = new DataTransformer();

    try {
      // Load PMML model
      File modelFile = new File(getClass().getClassLoader().getResource("random_forest_model.pmml").toURI());
      logger.info("Loading PMML model from: {}", modelFile.getAbsolutePath());

      PMML pmml = PMMLUtil.unmarshal(new FileInputStream(modelFile));

      // Validate PMML model
      if (pmml.getModels().isEmpty()) {
        throw new IllegalStateException("No models found in PMML file");
      }

      Model model = (Model) pmml.getModels().get(0);
      this.modelEvaluator = ModelEvaluatorFactory.newInstance().newModelEvaluator(pmml, model);

      // Verify model configuration
      if (modelEvaluator instanceof Evaluator) {
        logger.info("Model evaluator successfully initialized");
      } else {
        throw new IllegalStateException("Invalid model evaluator configuration");
      }

    } catch (Exception e) {
      logger.error("Failed to load PMML model", e);
      throw new RuntimeException("Failed to initialize PropertyMLService", e);
    }
  }

  // Method to estimate property price using the trained model
  public double estimatePropertyPrice(Map<String, Double> propertyFeatures) {
    // Validate input features
    validateInputFeatures(propertyFeatures);

    try {
      // Defensive copy to avoid modifying original
      Map<String, Double> transformedFeatures = new HashMap<>(propertyFeatures);
      // Log input features before transformations
      logger.debug("Input features before transformations: {}", transformedFeatures);

      // Apply transformations using DataTransformer
      Map<String, Object> transformedData = dataTransformer.transformData(transformedFeatures);

      // Apply additional squareScaler transformations if needed
      applySquareScaler(transformedFeatures);

      // Log dữ liệu sau khi chuẩn hóa
      logger.debug("Dữ liệu sau khi chuẩn hóa: {}", transformedFeatures);

      // Prepare input for model evaluation
      Map<String, Object> input = new HashMap<>(transformedData);

      // Log input features for debugging
      logger.debug("Model input features: {}", input);

      // Evaluate model
      Map<String, ?> evaluationResult = modelEvaluator.evaluate(input);

      // Extract price
      Object priceResult = evaluationResult.get("Price");

      if (priceResult == null) {
        throw new IllegalStateException("No price prediction returned from model");
      }

      // Inverse transform price
      double standardizedPrice = ((Number) priceResult).doubleValue();
      double actualPrice = zScoreScaler.inverseTransformSingle(standardizedPrice);

      logger.info("Property price estimated: {}", actualPrice);
      return actualPrice;

    } catch (Exception e) {
      logger.error("Error during property price estimation", e);
      throw new RuntimeException("Failed to estimate property price", e);
    }
  }

  // Validate that all required features are provided
  private void validateInputFeatures(Map<String, Double> propertyFeatures) {
    for (String feature : REQUIRED_FEATURES) {
      if (!propertyFeatures.containsKey(feature)) {
        logger.error("Missing required feature: {}", feature);
        throw new IllegalArgumentException("Missing required feature: " + feature);
      }
    }
  }

  // Apply squareScaler to features that require it
  private void applySquareScaler(Map<String, Double> features) {
    // Apply square root transformation to certain features
    features.put("Longitude", squareScaler.transformSingle(features.get("Longitude")));
    logger.debug("Transformed Longitude: {}", features.get("Longitude"));

    features.put("Latitude", squareScaler.transformSingle(features.get("Latitude")));
    logger.debug("Transformed Latitude: {}", features.get("Latitude"));

    features.put("Area (m²)", squareScaler.transformSingle(features.get("Area (m²)")));
    logger.debug("Transformed Area (m²): {}", features.get("Area (m²)"));

    features.put("Floors", squareScaler.transformSingle(features.get("Floors")));
    logger.debug("Transformed Floors: {}", features.get("Floors"));

    features.put("Rooms", squareScaler.transformSingle(features.get("Rooms")));
    logger.debug("Transformed Rooms: {}", features.get("Rooms"));

    features.put("Toilets", squareScaler.transformSingle(features.get("Toilets")));
    logger.debug("Transformed Toilets: {}", features.get("Toilets"));
  }
}
