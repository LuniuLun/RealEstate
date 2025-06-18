package apidemo.services;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apidemo.models.Property;
import apidemo.models.Property.PropertyStatus;
import apidemo.models.Role.RoleName;
import apidemo.models.ToxicityResponse;
import apidemo.models.User;
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
import java.util.function.Function;

@Service
public class PropertyService {

  private final PropertyRepository propertyRepository;
  private final CategoryService categoryService;
  private final PropertyLegalDocumentService propertyLegalDocumentService;
  private final UserService userService;
  private final LandService landService;
  private final HouseService houseService;
  private ToxicContentDetectionService toxicContentDetectionService;

  private final Filter filter = new Filter();

  public PropertyService(PropertyRepository propertyRepository,
      CategoryService categoryService,
      PropertyLegalDocumentService propertyLegalDocumentService,
      UserService userService, LandService landService, HouseService houseService,
      ToxicContentDetectionService toxicContentDetectionService) {
    this.propertyRepository = propertyRepository;
    this.categoryService = categoryService;
    this.propertyLegalDocumentService = propertyLegalDocumentService;
    this.userService = userService;
    this.landService = landService;
    this.houseService = houseService;
    this.toxicContentDetectionService = toxicContentDetectionService;
  }

  public Map<String, Object> getAllProperties(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);
    Specification<Property> spec = buildPropertySpecification(filters);

    long total = propertyRepository.count(spec);

    List<Property> properties = propertyRepository.findAll(spec, pageRequest).getContent();

    Map<String, Object> response = new HashMap<>();
    response.put("properties", properties);
    response.put("total", total);

    return response;
  }

  public Map<String, Object> getPropertiesByUser(Integer userId, Integer limit, Integer page,
      String sortBy, String typeOfSort, Map<String, String> filters) {

    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    userService.getUserById(userId);
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    if (filters == null) {
      filters = new HashMap<>();
    }
    filters.put("userId", userId.toString());

    Specification<Property> spec = buildPropertySpecification(filters);
    long total = propertyRepository.count(spec);
    List<Property> properties = propertyRepository.findAll(spec, pageRequest).getContent();

    Map<String, Object> response = new HashMap<>();
    response.put("properties", properties);
    response.put("total", total);

    return response;
  }

  public Specification<Property> buildPropertySpecification(Map<String, String> filters) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      applyCommonFilters(predicates, filters, cb, root);

      String category = filters.get("category");
      if (category != null) {
        switch (category) {
          case "1" -> landService.landFilters(predicates, filters, cb, root);
          case "2" -> houseService.houseFilters(predicates, filters, cb, root);
        }
      }

      return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private void applyCommonFilters(List<Predicate> predicates, Map<String, String> filters,
      CriteriaBuilder cb, Root<Property> root) {
    applyStringFilter(predicates, filters, "status",
        value -> cb.equal(root.get("status"), PropertyStatus.valueOf(value)), false);
    applyIntFilter(predicates, filters, "userId", value -> cb.equal(root.get("user").get("id"), value));
    applyIntFilter(predicates, filters, "category", value -> cb.equal(root.get("category").get("id"), value));
    applyIntFilter(predicates, filters, "direction", value -> cb.equal(root.get("direction"), value));
    applyStringFilter(predicates, filters, "region", value -> cb.like(root.get("region"), "%" + value + "%"), true);
    applyStringFilter(predicates, filters, "wardName", value -> cb.like(root.get("wardName"), "%" + value + "%"), true);
    applyStringFilter(predicates, filters, "streetName", value -> cb.like(root.get("streetName"), "%" + value + "%"),
        true);
    applyStringFilter(predicates, filters, "searchQuery", value -> cb.or(
        cb.like(root.get("title"), "%" + value + "%"),
        cb.like(root.get("description"), "%" + value + "%")), true);
    applyRangeFilter(predicates, filters, "price", "minPrice", "maxPrice", cb, root);
    applyRangeFilter(predicates, filters, "area", "minArea", "maxArea", cb, root);
  }

  private <T> void applyStringFilter(List<Predicate> predicates, Map<String, String> filters,
      String key, Function<String, Predicate> predicateBuilder,
      boolean skipEmpty) {
    Optional.ofNullable(filters.get(key))
        .filter(v -> !skipEmpty || !v.isEmpty())
        .ifPresent(value -> predicates.add(predicateBuilder.apply(value)));
  }

  private void applyIntFilter(List<Predicate> predicates, Map<String, String> filters,
      String key, Function<Integer, Predicate> predicateBuilder) {
    Optional.ofNullable(filters.get(key))
        .map(Integer::parseInt)
        .ifPresent(value -> predicates.add(predicateBuilder.apply(value)));
  }

  private void applyRangeFilter(List<Predicate> predicates, Map<String, String> filters,
      String fieldName, String minKey, String maxKey,
      CriteriaBuilder cb, Root<Property> root) {
    Double minValue = parseDoubleOrNull(filters.get(minKey));
    Double maxValue = parseDoubleOrNull(filters.get(maxKey));

    if (minValue != null && maxValue != null) {
      predicates.add(cb.between(root.get(fieldName), minValue, maxValue));
    } else if (minValue != null) {
      predicates.add(cb.greaterThanOrEqualTo(root.get(fieldName), minValue));
    } else if (maxValue != null) {
      predicates.add(cb.lessThanOrEqualTo(root.get(fieldName), maxValue));
    }
  }

  private Double parseDoubleOrNull(String value) {
    try {
      return value != null ? Double.parseDouble(value) : null;
    } catch (NumberFormatException e) {
      return null;
    }
  }

  public Property getPropertyById(int propertyId) {
    return propertyRepository.findById(propertyId)
        .orElseThrow(() -> new RuntimeException("Property does not exist"));
  }

  public List<Property> getPropertiesByUserId(int userId) {
    return propertyRepository.findByUser_id(userId);
  }

  public List<Property> getPropertiesByCategory(int categoryId) {
    return propertyRepository.findByCategory_id(categoryId);
  }

  public List<Property> getPropertiesByStatus(PropertyStatus status) {
    return propertyRepository.findByStatus(status);
  }

  @Transactional
  public Property createProperty(Property property) {
    validateAndPrepareProperty(property);
    User user = userService.getUserById(property.getUser().getId());

    long userPostCount = propertyRepository.countByUser_id(user.getId());

    if (user.getRole().getName() == RoleName.CUSTOMER && userPostCount >= 3) {
      throw new IllegalStateException("Tài khoản này đã đạt tối đa số lượng bài viết bất động sản.");
    }

    if (user.getRole().getName() == RoleName.BROKER && userPostCount >= 30) {
      throw new IllegalStateException("Tài khoản môi giới đã đạt tối đa số lượng bài viết bất động sản.");
    }

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

    if (property.getLand() != null) {
      landService.updateLand(property.getLand(), propertyDetails.getLand());
    }

    if (property.getHouse() != null) {
      houseService.updateHouse(property.getHouse(), propertyDetails.getHouse());
    }

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
    property.setDistrictName(propertyDetails.getDistrictName());
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
    requiredFields.put("District name", property.getDistrictName());
    requiredFields.put("Ward name", property.getWardName());
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

  /**
   * Determine property status based on toxicity scores.
   * - Toxicity >= 75%: Already handled elsewhere.
   * - Toxicity 50-74%: PENDING
   * - Toxicity < 50%: APPROVAL
   */
  public Property.PropertyStatus determinePropertyStatus(Property property) {
    try {
      double maxToxicScore = 0.0;

      String title = property.getTitle();
      String description = property.getDescription();

      if (title != null && !title.trim().isEmpty()) {
        ToxicityResponse titleToxicity = toxicContentDetectionService.detectToxicity(title);
        double titleToxicScore = titleToxicity.getToxicScore() * 100;
        maxToxicScore = Math.max(maxToxicScore, titleToxicScore);
      }

      if (description != null && !description.trim().isEmpty()) {
        ToxicityResponse descriptionToxicity = toxicContentDetectionService.detectToxicity(description);
        double descriptionToxicScore = descriptionToxicity.getToxicScore() * 100;
        maxToxicScore = Math.max(maxToxicScore, descriptionToxicScore);
      }

      if (maxToxicScore >= 75.0) {
        return Property.PropertyStatus.CANCELED;
      }

      if (maxToxicScore >= 50.0) {
        return Property.PropertyStatus.PENDING;
      }

      return Property.PropertyStatus.APPROVAL;

    } catch (Exception e) {
      return Property.PropertyStatus.PENDING;
    }
  }

  /**
   * Lấy số lượng bài viết có trạng thái
   */
  public long getCountPendingProperties() {
    return propertyRepository.countByStatus(PropertyStatus.PENDING);
  }

  public long getCountApprovedProperties() {
    return propertyRepository.countByStatus(PropertyStatus.APPROVAL);
  }

  public long getCountCanceledProperties() {
    return propertyRepository.countByStatus(PropertyStatus.CANCELED);
  }

  public long getCountPropertiesByStatus(PropertyStatus status) {
    return propertyRepository.countByStatus(status);
  }

  public long getCountPropertiesByStatusAndCategory(PropertyStatus status, int categoryId) {
    return propertyRepository.countByStatusAndCategory_id(status, categoryId);
  }

  public long getCountPropertiesByUserAndStatus(int userId, PropertyStatus status) {
    userService.getUserById(userId);
    return propertyRepository.countByUser_idAndStatus(userId, status);
  }

}