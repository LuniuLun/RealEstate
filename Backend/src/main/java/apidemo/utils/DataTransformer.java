package apidemo.utils;

import java.util.HashMap;
import java.util.Map;

public class DataTransformer {

  public Map<String, Object> transformData(Map<String, Double> features) {
    Map<String, Object> transformedFeatures = new HashMap<>();

    // Convert data from single value to list form
    transformedFeatures.put("Longitude", new double[] { features.get("Longitude") });
    transformedFeatures.put("Latitude", new double[] { features.get("Latitude") });
    transformedFeatures.put("Area (m²)", new double[] { features.get("Area (m²)") });
    transformedFeatures.put("Width (m)", new double[] { features.get("Width (m)") });
    transformedFeatures.put("Length (m)", new double[] { features.get("Length (m)") });
    transformedFeatures.put("Land Type", new double[] { features.get("Land Type") });
    transformedFeatures.put("House Direction", new double[] { features.get("House Direction") });
    transformedFeatures.put("Floors", new double[] { features.get("Floors") });
    transformedFeatures.put("Rooms", new double[] { features.get("Rooms") });
    transformedFeatures.put("Toilets", new double[] { features.get("Toilets") });
    transformedFeatures.put("Furnishing Sell", new double[] { features.get("Furnishing Sell") });
    transformedFeatures.put("Price", new double[] { features.get("Price") });
    transformedFeatures.put("Category_Encoded", new double[] { features.get("Category_Encoded") });
    transformedFeatures.put("1 Part Residential", new double[] { features.get("1 Part Residential") });
    transformedFeatures.put("Back Expansion", new double[] { features.get("Back Expansion") });
    transformedFeatures.put("Car Alley", new double[] { features.get("Car Alley") });
    transformedFeatures.put("Frontage", new double[] { features.get("Frontage") });
    transformedFeatures.put("No Residential", new double[] { features.get("No Residential") });

    return transformedFeatures;
  }
}
