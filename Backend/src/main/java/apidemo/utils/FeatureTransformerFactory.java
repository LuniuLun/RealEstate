package apidemo.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Factory for creating various feature transformers
 */
public class FeatureTransformerFactory {
  private static final Logger logger = LoggerFactory.getLogger(FeatureTransformerFactory.class);

  /**
   * Create a Z-score feature transformer
   * 
   * @param scalerParams Map of scaler parameters
   * @return A FeatureZscore instance
   */
  public static FeatureZscore createZscoreTransformer(Map<String, double[]> scalerParams) {
    logger.debug("Creating Z-score transformer with {} parameter sets", scalerParams.size());
    return new FeatureZscore(scalerParams);
  }

  /**
   * Create a root transformation feature transformer
   * 
   * @return A FeatureRootTransform instance
   */
  public static FeatureRootTransform createRootTransformer() {
    logger.debug("Creating root transform transformer");
    return new FeatureRootTransform();
  }
}