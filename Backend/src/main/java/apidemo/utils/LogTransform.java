package apidemo.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Responsible for transforming features using logarithmic transforms
 */
public class LogTransform {
  private static final Logger logger = LoggerFactory.getLogger(LogTransform.class);

  /**
   * Apply a logarithmic transformation to specified features
   *
   * @param originalFeatures    Map of original features
   * @param featuresToTransform Set of feature names to apply transformation to
   * @return Map of transformed features
   */
  public Map<String, Double> transform(Map<String, Double> originalFeatures,
      Set<String> featuresToTransform) {
    Map<String, Double> transformedFeatures = new HashMap<>(originalFeatures);

    for (String feature : featuresToTransform) {
      if (transformedFeatures.containsKey(feature)) {
        double original = transformedFeatures.get(feature);

        // Add a small constant to avoid log(0)
        double transformed = Math.log1p(original); // log(1+x)
        transformedFeatures.put(feature, transformed);
      }
    }

    return transformedFeatures;
  }

  /**
   * Inverse transform log-transformed values back to original scale
   *
   * @param transformedValue The log-transformed value
   * @return The original scale value
   */
  public double inverseTransform(double transformedValue) {
    double originalValue = Math.expm1(transformedValue); // exp(x)-1
    logger.debug("Inverse log transform: {} -> {}",
        transformedValue, originalValue);
    return originalValue;
  }
}