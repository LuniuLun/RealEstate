package apidemo.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Responsible for transforming features using root transforms (sqrt, cube root,
 * etc.)
 */
public class FeatureRootTransform {
  private static final Logger logger = LoggerFactory.getLogger(FeatureRootTransform.class);

  /**
   * Apply a root transformation to specified features
   *
   * @param originalFeatures    Map of original features
   * @param featuresToTransform Set of feature names to apply transformation to
   * @param rootFactor          Root factor (2 for square root, 3 for cube root,
   *                            etc.)
   * @return Map of transformed features
   */
  public Map<String, Double> transform(Map<String, Double> originalFeatures,
      Set<String> featuresToTransform,
      double rootFactor) {
    Map<String, Double> transformedFeatures = new HashMap<>(originalFeatures);

    for (String feature : featuresToTransform) {
      if (transformedFeatures.containsKey(feature)) {
        double original = transformedFeatures.get(feature);

        // Apply the root transformation using Math.pow()
        double transformed = Math.pow(original, 1.0 / rootFactor);
        transformedFeatures.put(feature, transformed);

        logger.debug("Root transformed feature {} (root={}): {} -> {}",
            feature, rootFactor, original, transformed);
      }
    }

    return transformedFeatures;
  }

  /**
   * Inverse transform root-transformed values back to original scale
   *
   * @param transformedValue The transformed value
   * @param rootFactor       Root factor (2 for square root, 3 for cube root,
   *                         etc.)
   * @return The original scale value
   */
  public double inverseTransform(double transformedValue, double rootFactor) {
    double originalValue = Math.pow(transformedValue, rootFactor);
    logger.debug("Inverse root transform (root={}): {} -> {}",
        rootFactor, transformedValue, originalValue);
    return originalValue;
  }
}