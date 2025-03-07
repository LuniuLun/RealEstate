package apidemo.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apidemo.models.House;
import apidemo.models.HouseCharacteristic;
import apidemo.models.HouseCharacteristicMapping;
import apidemo.models.Property;
import apidemo.repositories.HouseCharacteristicMappingRepository;
import apidemo.repositories.HouseCharacteristicRepository;

@Service
public class HouseService {

  @Autowired
  private HouseCharacteristicRepository houseCharacteristicRepository;

  @Autowired
  private HouseCharacteristicMappingRepository houseCharacteristicMappingRepository;

  // Cache to temporarily store house characteristic IDs during transaction
  private final Map<House, List<Integer>> houseCharacteristicsCache = new HashMap<>();

  /**
   * Prepares a house entity for saving by extracting characteristics and setting
   * up relationships
   */
  public House prepareHouse(House house, Property property) {
    // Extract house characteristics IDs
    List<Integer> houseCharacteristicIds = extractHouseCharacteristicIds(house);

    // Clear mappings to avoid save errors
    house.setHouseCharacteristicMappings(null);

    // Set property relationship
    house.setProperty(property);

    // Store IDs for later processing
    houseCharacteristicsCache.put(house, houseCharacteristicIds);

    return house;
  }

  /**
   * Processes house characteristics after the house entity has been saved
   */
  public void processHouseCharacteristics(House savedHouse) {
    List<Integer> characteristicIds = houseCharacteristicsCache.get(savedHouse);
    if (characteristicIds != null && !characteristicIds.isEmpty()) {
      // Create and save mappings
      Set<HouseCharacteristicMapping> mappings = createHouseCharacteristicMappings(savedHouse, characteristicIds);
      savedHouse.setHouseCharacteristicMappings(mappings);

      // Clean up cache
      houseCharacteristicsCache.remove(savedHouse);
    }
  }

  /**
   * Extracts house characteristic IDs from a house entity
   */
  private List<Integer> extractHouseCharacteristicIds(House house) {
    List<Integer> houseCharacteristicIds = new ArrayList<>();

    if (house.getHouseCharacteristicMappings() != null) {
      for (HouseCharacteristicMapping mapping : house.getHouseCharacteristicMappings()) {
        if (mapping.getHouseCharacteristic() != null && mapping.getHouseCharacteristic().getId() != null) {
          houseCharacteristicIds.add(mapping.getHouseCharacteristic().getId());
        }
      }
    }

    return houseCharacteristicIds;
  }

  /**
   * Creates and saves house characteristic mappings
   */
  private Set<HouseCharacteristicMapping> createHouseCharacteristicMappings(House house,
      List<Integer> characteristicIds) {
    Set<HouseCharacteristicMapping> mappings = new HashSet<>();

    for (Integer characteristicId : characteristicIds) {
      // Find house characteristic
      HouseCharacteristic characteristic = houseCharacteristicRepository.findById(characteristicId)
          .orElseThrow(() -> new RuntimeException("House characteristic not found with id: " + characteristicId));

      // Create mapping
      HouseCharacteristicMapping mapping = new HouseCharacteristicMapping();
      mapping.setHouse(house);
      mapping.setHouseCharacteristic(characteristic);

      // Save mapping
      mapping = houseCharacteristicMappingRepository.save(mapping);
      mappings.add(mapping);
    }

    return mappings;
  }
}