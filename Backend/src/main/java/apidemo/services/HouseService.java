package apidemo.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apidemo.models.House;
import apidemo.models.HouseCharacteristic;
import apidemo.models.HouseCharacteristicMapping;
import apidemo.models.Property;
import apidemo.repositories.HouseCharacteristicMappingRepository;
import apidemo.repositories.HouseCharacteristicRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

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
    List<Integer> houseCharacteristicIds = extractHouseCharacteristicIds(house);
    house.setHouseCharacteristicMappings(null);
    house.setProperty(property);
    houseCharacteristicsCache.put(house, houseCharacteristicIds);

    return house;
  }

  /**
   * Processes house characteristics after the house entity has been saved
   */
  public void processHouseCharacteristics(House savedHouse) {
    List<Integer> characteristicIds = houseCharacteristicsCache.get(savedHouse);
    if (characteristicIds != null && !characteristicIds.isEmpty()) {
      Set<HouseCharacteristicMapping> mappings = createHouseCharacteristicMappings(savedHouse, characteristicIds);
      savedHouse.setHouseCharacteristicMappings(mappings);

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

  public void houseFilters(List<Predicate> predicates, Map<String, String> filters,
      CriteriaBuilder criteriaBuilder, Root<Property> root) {
    Join<Property, House> houseJoin = root.join("house", JoinType.INNER);

    Stream.of("bedrooms", "toilets", "floors", "furnishedStatus").forEach(key -> Optional.ofNullable(filters.get(key))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .map(Integer::parseInt)
        .ifPresent(value -> predicates.add(
            "furnishedStatus".equals(key)
                ? criteriaBuilder.equal(houseJoin.get("furnishedStatus").get("id"), value)
                : criteriaBuilder.equal(houseJoin.get(key), value))));

    // houseCharacteristics
    Optional.ofNullable(filters.get("houseCharacteristics"))
        .map(value -> Arrays.stream(value.replace("[", "").replace("]", "").split(",\\s*"))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Integer::parseInt)
            .collect(Collectors.toList()))
        .ifPresent(characteristicIds -> characteristicIds.forEach(characteristicId -> {
          Join<House, HouseCharacteristicMapping> characteristicMappingJoin = houseJoin
              .join("houseCharacteristicMappings", JoinType.INNER);
          Join<HouseCharacteristicMapping, HouseCharacteristic> characteristicJoin = characteristicMappingJoin
              .join("houseCharacteristic", JoinType.INNER);
          predicates.add(criteriaBuilder.equal(characteristicJoin.get("id"), characteristicId));
        }));
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

  /**
   * Updates an existing house entity with new house data
   */
  public void updateHouse(House existingHouse, House newHouse) {
    existingHouse.setBedrooms(newHouse.getBedrooms());
    existingHouse.setFloors(newHouse.getFloors());
    existingHouse.setFurnishedStatus(newHouse.getFurnishedStatus());
    existingHouse.setToilets(newHouse.getToilets());

    if (newHouse.getHouseCharacteristicMappings() != null) {
      // Clear existing mappings
      houseCharacteristicMappingRepository.deleteAll(existingHouse.getHouseCharacteristicMappings());

      // Create and save new mappings
      Set<HouseCharacteristicMapping> newMappings = new HashSet<>();
      for (HouseCharacteristicMapping mapping : newHouse.getHouseCharacteristicMappings()) {
        HouseCharacteristic characteristic = houseCharacteristicRepository
            .findById(mapping.getHouseCharacteristic().getId())
            .orElseThrow(() -> new RuntimeException(
                "House characteristic not found with id: " + mapping.getHouseCharacteristic().getId()));

        HouseCharacteristicMapping newMapping = new HouseCharacteristicMapping();
        newMapping.setHouse(existingHouse);
        newMapping.setHouseCharacteristic(characteristic);

        newMappings.add(houseCharacteristicMappingRepository.save(newMapping));
      }
      existingHouse.setHouseCharacteristicMappings(newMappings);
    }
  }
}