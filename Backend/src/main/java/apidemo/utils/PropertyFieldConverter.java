package apidemo.utils;

import apidemo.models.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.List;

/**
 * Utility class for converting between ML model field names and entity field
 * names
 */
public class PropertyFieldConverter {
  /**
   * Create feature vectors for a forecast period based on a property request
   * 
   * @param request The forecast request containing property details
   * @param periods Number of days to forecast
   * @return List of feature vectors, one for each day in the forecast period
   */
  public static List<Map<String, Object>> createForecastFeatures(Property property, int periods) {
    List<Map<String, Object>> featureVectors = new ArrayList<>();
    LocalDate startDate = LocalDate.now();

    // Generate time series features for each day in the forecast period
    for (int i = 0; i < periods; i++) {
      LocalDate forecastDate = startDate.plusDays(i);

      // Combine property features with time features
      Map<String, Object> features = new HashMap<>();
      features.putAll(createPropertyFeatures(property));
      features.putAll(createTimeFeatures(forecastDate));

      featureVectors.add(features);
    }

    return featureVectors;
  }

  /**
   * Converts from entity fields format to ML model input fields
   *
   * @param property Property entity
   * @return Map containing the ML model input fields
   */
  public static Map<String, Double> createPropertyFeatures(Property property) {
    Map<String, Double> mlModelInput = new HashMap<>();

    // Basic property fields
    mlModelInput.put("Longitude", property.getLongitude());
    mlModelInput.put("Latitude", property.getLatitude());
    mlModelInput.put("Area", property.getArea());
    mlModelInput.put("Width", property.getWidth());
    mlModelInput.put("Length", property.getLength());

    // Apply square root transformation to selected fields
    applySquareRootTransformation(mlModelInput, "Longitude");
    applySquareRootTransformation(mlModelInput, "Latitude");
    applySquareRootTransformation(mlModelInput, "Area");
    applySquareRootTransformation(mlModelInput, "Length");
    applySquareRootTransformation(mlModelInput, "Width");

    // Direction encoding (one-hot)
    initializeDirectionFields(mlModelInput);
    if (property.getDirection() != null) {
      Integer directionId = property.getDirection().intValue();
      String directionName = getDirectionName(directionId);
      if (directionName != null) {
        mlModelInput.put("House_Direction_" + directionName, 1.0);
      }
    }

    // Set default values for house characteristics
    mlModelInput.put("Floors", 0.0);
    mlModelInput.put("Rooms", 0.0);
    mlModelInput.put("Toilets", 0.0);

    // House fields
    House house = property.getHouse();
    if (house != null) {
      mlModelInput.put("Floors", house.getFloors().doubleValue());
      mlModelInput.put("Rooms", house.getBedrooms().doubleValue());
      mlModelInput.put("Toilets", house.getToilets().doubleValue());

      // Apply square root transformation to house fields
      applySquareRootTransformation(mlModelInput, "Floors");
      applySquareRootTransformation(mlModelInput, "Rooms");
      applySquareRootTransformation(mlModelInput, "Toilets");

      // Furnishing status (one-hot)
      initializeFurnishingFields(mlModelInput);
      FurnishedStatus furnishedStatus = house.getFurnishedStatus();
      if (furnishedStatus != null) {
        String statusName = getFurnishedStatusName(furnishedStatus.getId());
        if (statusName != null) {
          mlModelInput.put("Furnishing_Sell_" + statusName, 1.0);
        }
      }
    } else {
      // Initialize furnishing fields with default values
      initializeFurnishingFields(mlModelInput);
    }

    // Set default values for land characteristics
    mlModelInput.put("1_Part_Residential", 0.0);
    mlModelInput.put("Back_Expansion", 0.0);
    mlModelInput.put("Car_Alley", 0.0);
    mlModelInput.put("Frontage", 0.0);
    mlModelInput.put("No_Residential", 0.0);
    mlModelInput.put("All_Residential", 0.0);

    // Land type (one-hot)
    initializeLandTypeFields(mlModelInput);

    // Land fields
    Land land = property.getLand();
    if (land != null) {
      // Land type
      LandType landType = land.getLandType();
      if (landType != null) {
        String landTypeName = getLandTypeName(landType.getId());
        if (landTypeName != null) {
          mlModelInput.put("Land_Type_" + landTypeName, 1.0);
        }
      }

      // Process land characteristics
      Set<LandCharacteristicMapping> landCharacteristicMappings = land.getLandCharacteristicMappings();
      if (landCharacteristicMappings != null) {
        for (LandCharacteristicMapping mapping : landCharacteristicMappings) {
          LandCharacteristic characteristic = mapping.getLandCharacteristic();
          if (characteristic != null) {
            String characteristicName = characteristic.getName();
            switch (characteristicName) {
              case "PARTIAL_RESIDENTIAL":
                mlModelInput.put("1_Part_Residential", 1.0);
                break;
              case "BACK_EXPANSION":
                mlModelInput.put("Back_Expansion", 1.0);
                break;
              case "CAR_ALLEY":
                mlModelInput.put("Car_Alley", 1.0);
                break;
              case "FRONTAGE":
                mlModelInput.put("Frontage", 1.0);
                break;
              case "NO_RESIDENTIAL":
                mlModelInput.put("No_Residential", 1.0);
                break;
              case "ALL_RESIDENTIAL":
                mlModelInput.put("All_Residential", 1.0);
                break;
            }
          }
        }
      }
    }

    mlModelInput.put("Category_LAND", property.getCategory().getId() == 1 ? 1.0 : 0.0);
    mlModelInput.put("Category_HOUSE", property.getCategory().getId() == 2 ? 1.0 : 0.0);

    return mlModelInput;
  }

  /**
   * Apply square root transformation to a field
   * 
   * @param data      Map containing the field
   * @param fieldName Name of the field to transform
   */
  private static void applySquareRootTransformation(Map<String, Double> data, String fieldName) {
    if (data.containsKey(fieldName) && data.get(fieldName) != null) {
      Double value = data.get(fieldName);
      if (value >= 0) {
        data.put(fieldName, Math.sqrt(value));
      }
    }
  }

  /**
   * Initialize direction fields with default values (0.0)
   * 
   * @param data Map to initialize
   */
  private static void initializeDirectionFields(Map<String, Double> data) {
    String[] directions = { "EAST", "WEST", "SOUTH", "NORTH",
        "SOUTHEAST", "SOUTHWEST", "NORTHEAST", "NORTHWEST" };

    for (String direction : directions) {
      data.put("House_Direction_" + direction, 0.0);
    }
  }

  /**
   * Initialize furnishing status fields with default values (0.0)
   * 
   * @param data Map to initialize
   */
  private static void initializeFurnishingFields(Map<String, Double> data) {
    String[] statuses = { "HIGH_END_FURNITURE", "FULLY_FURNISHED", "BASIC_FINISHING", "RAW_HANDOVER" };

    for (String status : statuses) {
      data.put("Furnishing_Sell_" + status, 0.0);
    }
  }

  /**
   * Initialize land type fields with default values (0.0)
   * 
   * @param data Map to initialize
   */
  private static void initializeLandTypeFields(Map<String, Double> data) {
    String[] landTypes = { "RESIDENTIAL_LAND", "PROJECT_LAND", "INDUSTRIAL_LAND", "AGRICULTURAL_LAND" };

    for (String landType : landTypes) {
      data.put("Land_Type_" + landType, 0.0);
    }
  }

  /**
   * Get the name of a direction based on its ID
   * 
   * @param id Direction ID
   * @return String representation of the direction
   */
  private static String getDirectionName(Integer id) {
    switch (id) {
      case 1:
        return "NORTH";
      case 2:
        return "SOUTH";
      case 3:
        return "EAST";
      case 4:
        return "WEST";
      case 5:
        return "NORTHEAST";
      case 6:
        return "SOUTHEAST";
      case 7:
        return "NORTHWEST";
      case 8:
        return "SOUTHWEST";
      default:
        return null;
    }
  }

  /**
   * Get the name of a furnished status based on its ID
   * 
   * @param id Furnished status ID
   * @return String representation of the furnished status
   */
  private static String getFurnishedStatusName(Integer id) {
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
   * Get the name of a land type based on its ID
   * 
   * @param id Land type ID
   * @return String representation of the land type
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
}