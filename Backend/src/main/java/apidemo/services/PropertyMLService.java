package apidemo.services;

import apidemo.models.Property;
import apidemo.utils.*;
import org.jpmml.evaluator.*;

import java.io.File;
import java.util.*;

public class PropertyMLService {
  private static final Set<String> REQUIRED_FEATURES = Set.of(
      "Longitude", "Latitude", "Area (m²)", "Floors", "Rooms", "Toilets", "Length (m)");

  private final Evaluator modelEvaluator;
  private final FeatureZscore featureZscore;
  private final FeatureRootTransform featureRootTransform;
  private final Map<String, double[]> scalerParams;

  private final Set<String> sqrtFeatures = Set.of("Longitude", "Latitude", "Area (m²)", "Floors", "Rooms", "Toilets");
  private final Set<String> zscoreFeatures = Set.of("Length (m)");

  public PropertyMLService() {
    try {
      File modelFile = new File(getClass().getClassLoader().getResource("random_forest_model.pmml").toURI());
      this.modelEvaluator = new LoadingModelEvaluatorBuilder().load(modelFile).build();
      modelEvaluator.verify();

      this.scalerParams = ScalerParamsLoader.loadParams();

      this.featureZscore = FeatureTransformerFactory.createZscoreTransformer(scalerParams);
      this.featureRootTransform = FeatureTransformerFactory.createRootTransformer();
    } catch (Exception e) {
      throw new RuntimeException("Initialization failed", e);
    }
  }

  public double estimatePropertyPrice(Property property) {
    Map<String, Double> propertyFeatures = PropertyFieldConverter.convertToMLModelFormat(property);
    validateInputFeatures(propertyFeatures);

    Map<String, Double> features = new HashMap<>(propertyFeatures);

    features = featureRootTransform.transform(features, sqrtFeatures, 2.0);
    features = featureZscore.scale(features, zscoreFeatures, 1, 1);

    Map<String, ?> evaluationResult = modelEvaluator.evaluate(features);
    evaluationResult = EvaluatorUtil.decodeAll(evaluationResult);

    Object priceResult = evaluationResult.get("y");

    double normalizedPrice;
    if (priceResult instanceof Map) {
      @SuppressWarnings("unchecked")
      Map<String, ?> resultMap = (Map<String, ?>) priceResult;
      Object result = resultMap.get("result");
      if (result == null) {
        throw new IllegalStateException("No price prediction returned");
      }
      normalizedPrice = ((Number) result).doubleValue();
    } else if (priceResult instanceof Number) {
      normalizedPrice = ((Number) priceResult).doubleValue();
    } else {
      throw new IllegalStateException("Unexpected result type: " + priceResult.getClass().getName());
    }

    return featureZscore.inverseTransform(normalizedPrice, 0, 0);
  }

  private void validateInputFeatures(Map<String, Double> features) {
    REQUIRED_FEATURES.forEach(feature -> {
      if (!features.containsKey(feature)) {
        throw new IllegalArgumentException("Missing required feature: " + feature);
      }
    });
  }
}
