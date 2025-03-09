package apidemo.services;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apidemo.models.Property;
import apidemo.repositories.PropertyRepository;
import apidemo.utils.Filter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PropertyService {

  private final PropertyRepository propertyRepository;
  private final CategoryService categoryService;
  private final PropertyLegalDocumentService propertyLegalDocumentService;
  private final UserService userService;
  private final PropertyMLService propertyMLService;
  private final LandService landService;
  private final HouseService houseService;
  private final Filter filter = new Filter();

  public PropertyService(PropertyRepository propertyRepository,
      CategoryService categoryService,
      PropertyLegalDocumentService propertyLegalDocumentService,
      UserService userService,
      LandService landService,
      HouseService houseService) {
    this.propertyRepository = propertyRepository;
    this.categoryService = categoryService;
    this.propertyLegalDocumentService = propertyLegalDocumentService;
    this.userService = userService;
    this.landService = landService;
    this.houseService = houseService;
    this.propertyMLService = new PropertyMLService();
  }

  public double getEstimatedPrice(Map<String, Double> propertyFeatures) {
    return propertyMLService.estimatePropertyPrice(propertyFeatures);
  }

  public List<Property> getAllProperties(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    // Validate page number
    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    // Configure pagination and sorting
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    // Build specification with filters
    Specification<Property> spec = buildPropertySpecification(filters);

    // Execute query
    return propertyRepository.findAll(spec, pageRequest).getContent();
  }

  /**
   * Builds a specification for Property filtering
   */
  private Specification<Property> buildPropertySpecification(Map<String, String> filters) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Apply text filters
      filters.forEach((key, value) -> {
        if (value != null && !value.isEmpty() &&
            !key.equals("minPrice") && !key.equals("maxPrice") &&
            !key.equals("minArea") && !key.equals("maxArea")) {
          predicates.add(criteriaBuilder.like(root.get(key).as(String.class), "%" + value + "%"));
        }
      });

      // Apply range filters
      applyRangeFilter(predicates, filters, "price", "minPrice", "maxPrice", criteriaBuilder, root);
      applyRangeFilter(predicates, filters, "area", "minArea", "maxArea", criteriaBuilder, root);

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }

  /**
   * Applies a numeric range filter for a given field
   */
  private void applyRangeFilter(List<Predicate> predicates, Map<String, String> filters,
      String fieldName, String minKey, String maxKey,
      CriteriaBuilder criteriaBuilder, Root<Property> root) {
    String minValue = filters.get(minKey);
    String maxValue = filters.get(maxKey);

    if (minValue != null && !minValue.isEmpty() && maxValue != null && !maxValue.isEmpty()) {
      try {
        double min = Double.parseDouble(minValue);
        double max = Double.parseDouble(maxValue);
        predicates.add(criteriaBuilder.between(root.get(fieldName), min, max));
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid " + fieldName + " range values");
      }
    }
  }

  public Property getPropertyById(int propertyId) {
    return propertyRepository.findById(propertyId)
        .orElseThrow(() -> new RuntimeException("Property does not exist"));
  }

  public List<Property> getPropertiesById(int userId) {
    return propertyRepository.findByUser_id(userId);
  }

  public List<Property> getPropertiesByCategory(int categoryId) {
    return propertyRepository.findByCategory_id(categoryId);
  }

  public List<Property> getPropertiesByStatus(String status) {
    return propertyRepository.findByStatus(status);
  }

  @Transactional
  public Property createProperty(Property property) {
    validateAndPrepareProperty(property);

    Property savedProperty = propertyRepository.save(property);

    if (property.getLand() != null) {
      landService.processLandCharacteristics(property.getLand());
    }

    if (property.getHouse() != null) {
      houseService.processHouseCharacteristics(property.getHouse());
    }

    return savedProperty;
  }

  @Transactional
  public Property updateProperty(int propertyId, Property propertyDetails) {
    Property property = getPropertyById(propertyId);
    validatePropertyReferences(propertyDetails);
    validateProperty(propertyDetails);
    updatePropertyFields(property, propertyDetails);

    return propertyRepository.save(property);
  }

  @Transactional
  public Property updatePropertyStatus(int propertyId, String status) {
    Property property = getPropertyById(propertyId);

    try {
      property.setStatus(Property.PropertyStatus.valueOf(status));
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid status value. Must be PENDING, APPROVAL, or CANCELED");
    }

    return propertyRepository.save(property);
  }

  @Transactional
  public void deleteProperty(int propertyId) {
    Property property = getPropertyById(propertyId);

    propertyRepository.delete(property);
  }

  private void validateAndPrepareProperty(Property property) {
    validatePropertyReferences(property);
    validateProperty(property);

    if (property.getStatus() == null) {
      property.setStatus(Property.PropertyStatus.PENDING);
    }

    if (property.getLand() != null) {
      property.setLand(landService.prepareLand(property.getLand(), property));
    }

    if (property.getHouse() != null) {
      property.setHouse(houseService.prepareHouse(property.getHouse(), property));
    }
  }

  private void updatePropertyFields(Property property, Property propertyDetails) {
    property.setTitle(propertyDetails.getTitle());
    property.setDescription(propertyDetails.getDescription());
    property.setRegion(propertyDetails.getRegion());
    property.setWardName(propertyDetails.getWardName());
    property.setStreetName(propertyDetails.getStreetName());
    property.setLongitude(propertyDetails.getLongitude());
    property.setLatitude(propertyDetails.getLatitude());
    property.setDirection(propertyDetails.getDirection());
    property.setArea(propertyDetails.getArea());
    property.setLength(propertyDetails.getLength());
    property.setWidth(propertyDetails.getWidth());
    property.setImages(propertyDetails.getImages());
    property.setPrice(propertyDetails.getPrice());
    property.setStatus(propertyDetails.getStatus());
    property.setCategory(propertyDetails.getCategory());
    property.setUser(propertyDetails.getUser());
    property.setPropertyLegalDocument(propertyDetails.getPropertyLegalDocument());
  }

  private void validatePropertyReferences(Property property) {
    if (property.getCategory() != null && property.getCategory().getId() != null) {
      categoryService.getCategoryById(property.getCategory().getId())
          .orElseThrow(() -> new RuntimeException("Category does not exist"));
    } else {
      throw new RuntimeException("Category is required for property");
    }

    if (property.getUser() != null && property.getUser().getId() != null) {
      userService.getUserById(property.getUser().getId());
    } else {
      throw new RuntimeException("User is required for property");
    }

    if (property.getPropertyLegalDocument() != null && property.getPropertyLegalDocument().getId() != null) {
      propertyLegalDocumentService.getPropertyLegalDocumentById(property.getPropertyLegalDocument().getId())
          .orElseThrow(() -> new RuntimeException("Property legal document does not exist"));
    } else {
      throw new RuntimeException("Property legal document is required for property");
    }
  }

  private void validateProperty(Property property) {
    Map<String, Object> requiredFields = new HashMap<>();
    requiredFields.put("Title", property.getTitle());
    requiredFields.put("Description", property.getDescription());
    requiredFields.put("Region", property.getRegion());
    requiredFields.put("Ward name", property.getWardName());
    requiredFields.put("Street name", property.getStreetName());
    requiredFields.put("Longitude", property.getLongitude());
    requiredFields.put("Latitude", property.getLatitude());
    requiredFields.put("Direction", property.getDirection());
    requiredFields.put("Area", property.getArea());
    requiredFields.put("Length", property.getLength());
    requiredFields.put("Width", property.getWidth());
    requiredFields.put("Price", property.getPrice());
    requiredFields.put("Category", property.getCategory());
    requiredFields.put("User", property.getUser());
    requiredFields.put("Property legal document", property.getPropertyLegalDocument());

    requiredFields.forEach((fieldName, value) -> {
      if (value == null || (value instanceof String && ((String) value).isEmpty())) {
        throw new RuntimeException(fieldName + " is required for property");
      }
    });

    if (property.getImages() == null || property.getImages().isEmpty()) {
      throw new RuntimeException("At least one image is required for property");
    }
  }
}