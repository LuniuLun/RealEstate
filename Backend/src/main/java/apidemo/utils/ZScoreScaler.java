package apidemo.utils;

import java.util.Arrays;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.net.URI;
import java.net.URISyntaxException;

public class ZScoreScaler {
  private double mean;
  private double std;
  private static final String FILE_PATH = "scaler_params.csv";

  public ZScoreScaler() {
    try {
      URL resource = getClass().getClassLoader().getResource(FILE_PATH);
      if (resource != null) {
        try {
          // Chuyển URL thành URI
          URI uri = resource.toURI();
          File file = new File(uri);

          // Đọc tệp CSV
          try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line = br.readLine();
            if (line != null) {
              String[] values = line.split(",");
              try {
                // Attempt to parse the values
                this.mean = Double.parseDouble(values[0]);
                this.std = Double.parseDouble(values[1]);
              } catch (NumberFormatException e) {
                System.err.println("Invalid number format in scaler_params.csv: " + e.getMessage());
              }
            }
          }
        } catch (URISyntaxException e) {
          System.err.println("Error converting URL to URI: " + e.getMessage());
        }
      } else {
        System.err.println("File not found: " + FILE_PATH);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  // Transform method to standardize data
  public double[] transform(double[] data) {
    return Arrays.stream(data)
        .map(x -> (x - mean) / std)
        .toArray();
  }

  // Transform single value
  public double transformSingle(double value) {
    return (value - mean) / std;
  }

  // Inverse transform to denormalize data
  public double[] inverseTransform(double[] data) {
    return Arrays.stream(data)
        .map(x -> x * std + mean)
        .toArray();
  }

  // Inverse transform single value
  public double inverseTransformSingle(double value) {
    return value * std + mean;
  }
}
