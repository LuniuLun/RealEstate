package apidemo.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apidemo.models.Land;
import apidemo.models.LandCharacteristic;
import apidemo.models.LandCharacteristicMapping;
import apidemo.models.Property;
import apidemo.repositories.LandCharacteristicMappingRepository;
import apidemo.repositories.LandCharacteristicRepository;

@Service
public class LandService {

  @Autowired
  private LandCharacteristicRepository landCharacteristicRepository;

  @Autowired
  private LandCharacteristicMappingRepository landCharacteristicMappingRepository;

  // Cache to temporarily store land characteristic IDs during transaction
  private final Map<Land, List<Integer>> landCharacteristicsCache = new HashMap<>();

  /**
   * Prepares a land entity for saving by extracting characteristics and setting
   * up relationships
   */
  public Land prepareLand(Land land, Property property) {
    // Extract land characteristics IDs
    List<Integer> landCharacteristicIds = extractLandCharacteristicIds(land);

    // Clear mappings to avoid save errors
    land.setLandCharacteristicMappings(null);

    // Set property relationship
    land.setProperty(property);

    // Store IDs for later processing
    landCharacteristicsCache.put(land, landCharacteristicIds);

    return land;
  }

  /**
   * Processes land characteristics after the land entity has been saved
   */
  public void processLandCharacteristics(Land savedLand) {
    List<Integer> characteristicIds = landCharacteristicsCache.get(savedLand);
    if (characteristicIds != null && !characteristicIds.isEmpty()) {
      // Create and save mappings
      Set<LandCharacteristicMapping> mappings = createLandCharacteristicMappings(savedLand, characteristicIds);
      savedLand.setLandCharacteristicMappings(mappings);

      // Clean up cache
      landCharacteristicsCache.remove(savedLand);
    }
  }

  /**
   * Extracts land characteristic IDs from a land entity
   */
  private List<Integer> extractLandCharacteristicIds(Land land) {
    List<Integer> landCharacteristicIds = new ArrayList<>();

    if (land.getLandCharacteristicMappings() != null) {
      for (LandCharacteristicMapping mapping : land.getLandCharacteristicMappings()) {
        if (mapping.getLandCharacteristic() != null && mapping.getLandCharacteristic().getId() != null) {
          landCharacteristicIds.add(mapping.getLandCharacteristic().getId());
        }
      }
    }

    return landCharacteristicIds;
  }

  /**
   * Creates and saves land characteristic mappings
   */
  private Set<LandCharacteristicMapping> createLandCharacteristicMappings(Land land, List<Integer> characteristicIds) {
    Set<LandCharacteristicMapping> mappings = new HashSet<>();

    for (Integer characteristicId : characteristicIds) {
      // Find land characteristic
      LandCharacteristic characteristic = landCharacteristicRepository.findById(characteristicId)
          .orElseThrow(() -> new RuntimeException("Land characteristic not found with id: " + characteristicId));

      // Create mapping
      LandCharacteristicMapping mapping = new LandCharacteristicMapping();
      mapping.setLand(land);
      mapping.setLandCharacteristic(characteristic);

      // Save mapping
      mapping = landCharacteristicMappingRepository.save(mapping);
      mappings.add(mapping);
    }

    return mappings;
  }
}