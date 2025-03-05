package apidemo.utils;

import java.util.Arrays;

public class SquareScaler {

  private double scale;

  // Fit method to determine scale from external data
  public void fit(double scaleFactor) {
    this.scale = scaleFactor;
  }

  // Transform method to scale data by squaring
  public double[] transform(double[] data) {
    return Arrays.stream(data)
        .map(x -> x * scale)
        .toArray();
  }

  // Transform single value
  public double transformSingle(double value) {
    return value * scale;
  }

  // Inverse transform single value
  public double inverseTransformSingle(double value) {
    return value / scale;
  }

  // Inverse transform to reverse the scaling
  public double[] inverseTransform(double[] data) {
    return Arrays.stream(data)
        .map(x -> x / scale)
        .toArray();
  }
}