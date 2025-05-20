package apidemo.utils;

import apidemo.models.ForecastRequest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Converter for transforming ForecastRequest into features for the forecast
 * model
 */
public class ForecastPropertyFieldConverter {
  private static final FeatureZscore featureZscore;

  static {
    Map<String, double[]> scalerParams = ScalerParamsLoader.loadParams();
    featureZscore = new FeatureZscore(scalerParams);
  }

  /**
   * Create feature vectors for a forecast period based on a property request
   * 
   * @param request The forecast request containing property details
   * @param periods Number of days to forecast
   * @return List of feature vectors, one for each day in the forecast period
   */
  public static List<Map<String, Object>> createForecastFeatures(ForecastRequest request, int periods) {
    List<Map<String, Object>> featureVectors = new ArrayList<>();
    LocalDate startDate = LocalDate.now();

    // Generate time series features for each day in the forecast period
    for (int i = 0; i < periods; i++) {
      LocalDate forecastDate = startDate.plusDays(i);

      // Combine property features with time features
      Map<String, Object> features = new HashMap<>();
      features.putAll(createPropertyFeatures(request));
      features.putAll(createTimeFeatures(forecastDate));

      featureVectors.add(features);
    }

    return featureVectors;
  }

  /**
   * Create property-specific features based on the request
   * 
   * @param request The forecast request
   * @return Map of property features
   */
  public static Map<String, Object> createPropertyFeatures(ForecastRequest request) {
    Map<String, Object> features = new HashMap<>();

    // Basic property dimensions
    features.put("Width", request.getWidth());
    features.put("Length", request.getLength());
    features.put("Floors", request.getFloors());
    features.put("Rooms", request.getRooms());
    features.put("Toilets", request.getToilets());

    // Apply square root transformation to selected fields
    applySquareRootTransformation(features, "Width");
    applySquareRootTransformation(features, "Floors");
    applySquareRootTransformation(features, "Rooms");
    applySquareRootTransformation(features, "Toilets");

    // Apply Z-score normalization to Length field
    Set<String> lengthField = new HashSet<>();
    lengthField.add("Length");

    // Convert features to Map<String, Double> for scaling
    Map<String, Double> doubleFeatures = new HashMap<>();
    for (Map.Entry<String, Object> entry : features.entrySet()) {
      if (entry.getValue() instanceof Number) {
        doubleFeatures.put(entry.getKey(), ((Number) entry.getValue()).doubleValue());
      }
    }

    // Apply scaling and get the result
    Map<String, Double> scaledDoubleFeatures = featureZscore.scale(doubleFeatures, lengthField, 1, 1);

    // Update the original features with scaled values
    for (Map.Entry<String, Double> entry : scaledDoubleFeatures.entrySet()) {
      features.put(entry.getKey(), entry.getValue());
    }

    // Land characteristics
    addLandCharacteristics(features, request.getLandCharacteristics());

    // Category (house or land)
    features.put("Category_LAND", request.getCategoryId() == 1 ? 1 : 0);
    features.put("Category_HOUSE", request.getCategoryId() == 2 ? 1 : 0);

    addDistrictFeatures(features, request.getDistrict());
    addDirectionFeatures(features, request.getDirectionId());
    addFurnishingFeatures(features, request.getFurnishingId());
    addLandTypeFeatures(features, request.getLandTypeId());

    return features;
  }

  /**
   * Create time-based features for a specific date
   * 
   * @param date The date for which to create features
   * @return Map of time features
   */
  public static Map<String, Object> createTimeFeatures(LocalDate date) {
    Map<String, Object> features = new HashMap<>();

    // Basic date components
    features.put("year", date.getYear());
    features.put("month", date.getMonthValue());
    features.put("day", date.getDayOfMonth());
    features.put("dayofweek", date.getDayOfWeek().getValue() % 7); // 0-6 format
    features.put("quarter", (date.getMonthValue() - 1) / 3 + 1);

    return features;
  }

  /**
   * Add land characteristics features
   * 
   * @param features            Map to add features to
   * @param landCharacteristics List of land characteristic IDs
   */
  private static void addLandCharacteristics(Map<String, Object> features, List<Integer> landCharacteristics) {
    // Initialize all to 0
    features.put("1 Part Residential", 0);
    features.put("All Residential", 0);
    features.put("Back Expansion", 0);
    features.put("Car Alley", 0);
    features.put("Frontage", 0);
    features.put("No Residential", 0);

    // Set the ones that are present
    if (landCharacteristics != null) {
      for (Integer id : landCharacteristics) {
        switch (id) {
          case 1:
            features.put("1 Part Residential", 1);
            break;
          case 2:
            features.put("All Residential", 1);
            break;
          case 3:
            features.put("Back Expansion", 1);
            break;
          case 4:
            features.put("Car Alley", 1);
            break;
          case 5:
            features.put("Frontage", 1);
            break;
          case 6:
            features.put("No Residential", 1);
            break;
        }
      }
    }
  }

  /**
   * Add district one-hot encoding features
   * 
   * @param features Map to add features to
   * @param district District name
   */
  private static void addDistrictFeatures(Map<String, Object> features, String district) {
    String[] districts = {
        "Huyện Hòa Vang", "Quận Cẩm Lệ", "Quận Hải Châu", "Quận Liên Chiểu",
        "Quận Ngũ Hành Sơn", "Quận Sơn Trà", "Quận Thanh Khê"
    };

    for (String d : districts) {
      features.put("District_" + d, d.equals(district) ? 1 : 0);
    }
  }

  /**
   * Add direction one-hot encoding features
   * 
   * @param features    Map to add features to
   * @param directionId Direction ID
   */
  private static void addDirectionFeatures(Map<String, Object> features, Integer directionId) {
    String[] directions = {
        "EAST", "NORTH", "NORTHEAST", "NORTHWEST",
        "SOUTH", "SOUTHEAST", "SOUTHWEST", "WEST"
    };

    // Default all to 0
    for (String direction : directions) {
      features.put("House Direction_" + direction, 0);
    }

    // Set the appropriate one to 1
    if (directionId != null && directionId >= 1 && directionId <= 8) {
      String direction = getDirectionName(directionId);
      if (direction != null) {
        features.put("House Direction_" + direction, 1);
      }
    }
  }

  /**
   * Add furnishing one-hot encoding features
   * 
   * @param features     Map to add features to
   * @param furnishingId Furnishing ID
   */
  private static void addFurnishingFeatures(Map<String, Object> features, Integer furnishingId) {
    String[] furnishingTypes = {
        "HIGH_END_FURNITURE", "FULLY_FURNISHED", "BASIC_FINISHING", "RAW_HANDOVER"
    };

    // Default all to 0
    for (String type : furnishingTypes) {
      features.put("Furnishing Sell_" + type, 0);
    }

    // Set the appropriate one to 1
    if (furnishingId != null && furnishingId >= 1 && furnishingId <= 4) {
      String type = getFurnishingName(furnishingId);
      if (type != null) {
        features.put("Furnishing Sell_" + type, 1);
      }
    }
  }

  /**
   * Add land type one-hot encoding features
   * 
   * @param features   Map to add features to
   * @param landTypeId Land type ID
   */
  private static void addLandTypeFeatures(Map<String, Object> features, Integer landTypeId) {
    String[] landTypes = {
        "RESIDENTIAL_LAND", "PROJECT_LAND", "INDUSTRIAL_LAND", "AGRICULTURAL_LAND"
    };

    // Default all to 0
    for (String type : landTypes) {
      features.put("Land Type_" + type, 0);
    }

    // Set the appropriate one to 1
    if (landTypeId != null && landTypeId >= 1 && landTypeId <= 4) {
      String type = getLandTypeName(landTypeId);
      if (type != null) {
        features.put("Land Type_" + type, 1);
      }
    }
  }

  /**
   * Get direction name from ID
   * 
   * @param id Direction ID
   * @return Direction name
   */
  private static String getDirectionName(Integer id) {
    switch (id) {
      case 1:
        return "EAST";
      case 2:
        return "NORTH";
      case 3:
        return "NORTHEAST";
      case 4:
        return "NORTHWEST";
      case 5:
        return "SOUTH";
      case 6:
        return "SOUTHEAST";
      case 7:
        return "SOUTHWEST";
      case 8:
        return "WEST";
      default:
        return null;
    }
  }

  /**
   * Get furnishing name from ID
   * 
   * @param id Furnishing ID
   * @return Furnishing name
   */
  private static String getFurnishingName(Integer id) {
    switch (id) {
      case 1:
        return "HIGH_END_FURNITURE";
      case 2:
        return "FULLY_FURNISHED";
      case 3:
        return "BASIC_FINISHING";
      case 4:
        return "RAW_HANDOVER";
      default:
        return null;
    }
  }

  /**
   * Get land type name from ID
   * 
   * @param id Land type ID
   * @return Land type name
   */
  private static String getLandTypeName(Integer id) {
    switch (id) {
      case 1:
        return "RESIDENTIAL_LAND";
      case 2:
        return "PROJECT_LAND";
      case 3:
        return "INDUSTRIAL_LAND";
      case 4:
        return "AGRICULTURAL_LAND";
      default:
        return null;
    }
  }

  /**
   * Apply square root transformation to a field in the data map
   * 
   * @param data      Map containing the data
   * @param fieldName Field name to transform
   */
  private static void applySquareRootTransformation(Map<String, Object> data, String fieldName) {
    if (data.containsKey(fieldName) && data.get(fieldName) != null) {
      Object value = data.get(fieldName);
      if (value instanceof Number) {
        double numValue = ((Number) value).doubleValue();
        if (numValue >= 0) {
          data.put(fieldName, Math.sqrt(numValue));
        }
      }
    }
  }
}