package apidemo.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Responsible for scaling features using Z-score normalization
 */
public class FeatureZscore {
  private final Map<String, double[]> scalerParams;

  /**
   * Constructor with scaler parameters
   *
   * @param scalerParams Map containing mean and standard deviation parameters
   */
  public FeatureZscore(Map<String, double[]> scalerParams) {
    this.scalerParams = scalerParams;
  }

  /**
   * Scale features using Z-score normalization
   *
   * @param features        Map of features to scale
   * @param featuresToScale Set of feature names to apply scaling to
   * @param meanIndex       Index in the parameters array for the mean value
   * @param stdIndex        Index in the parameters array for the standard
   *                        deviation value
   * @return Map of scaled features
   */
  public Map<String, Double> scale(Map<String, Double> features, Set<String> featuresToScale,
      int meanIndex, int stdIndex) {
    Map<String, Double> scaledFeatures = new HashMap<>(features);

    for (String feature : featuresToScale) {
      if (scaledFeatures.containsKey(feature)) {
        double[] stdParams = scalerParams.get("std");
        double[] meanParams = scalerParams.get("mean");

        if (stdParams != null && meanParams != null && stdParams.length > stdIndex && meanParams.length > meanIndex) {
          double value = scaledFeatures.get(feature);
          double normalizedValue = (value - meanParams[meanIndex]) / stdParams[stdIndex];
          scaledFeatures.put(feature, normalizedValue);
        }
      }
    }

    return scaledFeatures;
  }

  /**
   * Inverse transform Z-score normalized values back to original scale
   *
   * @param normalizedValue The normalized value
   * @param meanIndex       Index in the parameters array for the mean value
   * @param stdIndex        Index in the parameters array for the standard
   *                        deviation value
   * @return The original scale value
   */
  public double inverseTransform(double normalizedValue, int meanIndex, int stdIndex) {
    double[] stdParams = scalerParams.get("std");
    double[] meanParams = scalerParams.get("mean");

    if (stdParams != null && meanParams != null && stdParams.length > stdIndex && meanParams.length > meanIndex) {
      return normalizedValue * stdParams[stdIndex] + meanParams[meanIndex];
    }

    return normalizedValue;
  }
}