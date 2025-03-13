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
    List<Integer> landCharacteristicIds = extractLandCharacteristicIds(land);
    land.setLandCharacteristicMappings(null);
    land.setProperty(property);
    landCharacteristicsCache.put(land, landCharacteristicIds);

    return land;
  }

  /**
   * Processes land characteristics after the land entity has been saved
   */
  public void processLandCharacteristics(Land savedLand) {
    List<Integer> characteristicIds = landCharacteristicsCache.get(savedLand);
    if (characteristicIds != null && !characteristicIds.isEmpty()) {
      Set<LandCharacteristicMapping> mappings = createLandCharacteristicMappings(savedLand, characteristicIds);
      savedLand.setLandCharacteristicMappings(mappings);

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

  /**
   * Updates an existing land entity with new land data
   */
  public void updateLand(Land existingLand, Land newLand) {
    existingLand.setLandType(newLand.getLandType());

    if (newLand.getLandCharacteristicMappings() != null) {
      // Clear existing mappings
      landCharacteristicMappingRepository.deleteAll(existingLand.getLandCharacteristicMappings());

      // Create and save new mappings
      Set<LandCharacteristicMapping> newMappings = new HashSet<>();
      for (LandCharacteristicMapping mapping : newLand.getLandCharacteristicMappings()) {
        LandCharacteristic characteristic = landCharacteristicRepository
            .findById(mapping.getLandCharacteristic().getId())
            .orElseThrow(() -> new RuntimeException(
                "Land characteristic not found with id: " + mapping.getLandCharacteristic().getId()));

        LandCharacteristicMapping newMapping = new LandCharacteristicMapping();
        newMapping.setLand(existingLand);
        newMapping.setLandCharacteristic(characteristic);

        newMappings.add(landCharacteristicMappingRepository.save(newMapping));
      }
      existingLand.setLandCharacteristicMappings(newMappings);
    }
  }
}