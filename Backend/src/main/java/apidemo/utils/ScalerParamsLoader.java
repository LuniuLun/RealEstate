package apidemo.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Responsible for loading scaler parameters from file
 */
public class ScalerParamsLoader {
  private static final String SCALER_FILE_PATH = "scaler_params.csv";

  public static Map<String, double[]> loadParams() {
    Map<String, double[]> params = new HashMap<>();

    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
        Objects.requireNonNull(ScalerParamsLoader.class.getClassLoader()
            .getResourceAsStream(SCALER_FILE_PATH))))) {

      // Skip header
      reader.readLine();

      String line;
      while ((line = reader.readLine()) != null) {
        String[] values = line.split(",");
        if (values.length == 3) {
          String key = values[0];
          double value1 = Double.parseDouble(values[1]);
          double value2 = Double.parseDouble(values[2]);

          params.put(key, new double[] { value1, value2 });
        }
      }

      return params;
    } catch (Exception e) {
      throw new RuntimeException("Failed to load scaler parameters", e);
    }
  }
}