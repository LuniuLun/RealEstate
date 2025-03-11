package apidemo.utils;

import apidemo.models.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Utility class for converting between ML model field names and entity field
 * names
 */
public class PropertyFieldConverter {
  /**
   * Converts from entity fields format to ML model input fields
   *
   * @param property Property entity
   * @return Map containing the ML model input fields
   */
  public static Map<String, Double> convertToMLModelFormat(Property property) {
    Map<String, Double> mlModelInput = new HashMap<>();

    // Property fields
    mlModelInput.put("Longitude", property.getLongitude());
    mlModelInput.put("Latitude", property.getLatitude());
    mlModelInput.put("Area (m²)", property.getArea());
    mlModelInput.put("Width (m)", property.getWidth());
    mlModelInput.put("Length (m)", property.getLength());
    mlModelInput.put("House Direction", property.getDirection().doubleValue());

    // Set default values for house characteristics
    mlModelInput.put("Floors", 0.0);
    mlModelInput.put("Rooms", 0.0);
    mlModelInput.put("Toilets", 0.0);
    mlModelInput.put("Furnishing Sell", 0.0);
    // House fields
    House house = property.getHouse();
    if (house != null) {
      mlModelInput.put("Floors", house.getFloors().doubleValue());
      mlModelInput.put("Rooms", house.getBedrooms().doubleValue());
      mlModelInput.put("Toilets", house.getToilets().doubleValue());

      // Furnishing status
      FurnishedStatus furnishedStatus = house.getFurnishedStatus();
      if (furnishedStatus != null) {
        mlModelInput.put("Furnishing Sell", furnishedStatus.getId().doubleValue());
      }
    }

    // Set default values for land characteristics
    mlModelInput.put("1 Part Residential", 0.0);
    mlModelInput.put("Back Expansion", 0.0);
    mlModelInput.put("Car Alley", 0.0);
    mlModelInput.put("Frontage", 0.0);
    mlModelInput.put("No Residential", 0.0);
    mlModelInput.put("All Residential", 0.0);
    mlModelInput.put("Land Type", 0.0);
    // Land fields
    Land land = property.getLand();
    if (land != null) {
      // Land type
      LandType landType = land.getLandType();
      if (landType != null) {
        mlModelInput.put("Land Type", landType.getId().doubleValue());
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
                mlModelInput.put("1 Part Residential", 1.0);
                break;
              case "BACK_EXPANSION":
                mlModelInput.put("Back Expansion", 1.0);
                break;
              case "CAR_ALLEY":
                mlModelInput.put("Car Alley", 1.0);
                break;
              case "FRONTAGE":
                mlModelInput.put("Frontage", 1.0);
                break;
              case "NO_RESIDENTIAL":
                mlModelInput.put("No Residential", 1.0);
                break;
              case "ALL_RESIDENTIAL":
                mlModelInput.put("All Residential", 1.0);
                break;
            }
          }
        }
      }
    }

    // Category encoding
    mlModelInput.put("Category_Encoded", property.getCategory().getId().doubleValue() - 1);

    return mlModelInput;
  }
}