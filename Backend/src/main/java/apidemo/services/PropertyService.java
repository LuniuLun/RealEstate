package apidemo.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apidemo.models.Property;
import apidemo.repositories.PropertyRepository;
import jakarta.persistence.criteria.Predicate;

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

  public PropertyService(PropertyRepository propertyRepository,
      CategoryService categoryService,
      PropertyLegalDocumentService propertyLegalDocumentService,
      UserService userService) {
    this.propertyRepository = propertyRepository;
    this.categoryService = categoryService;
    this.propertyLegalDocumentService = propertyLegalDocumentService;
    this.userService = userService;
    this.propertyMLService = new PropertyMLService();
  }

  public double getEstimatedPrice(Map<String, Double> propertyFeatures) {
    return propertyMLService.estimatePropertyPrice(propertyFeatures);
  }

  public List<Property> getAllProperties(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    // Determine sort direction, and use a default field if none is provided
    Sort.Direction direction = ("asc".equalsIgnoreCase(typeOfSort)) ? Sort.Direction.ASC : Sort.Direction.DESC;
    String sortField = (sortBy == null || sortBy.isEmpty()) ? "propertyId" : sortBy;
    Pageable pageRequest = (limit != null && page != null)
        ? PageRequest.of(page - 1, limit, Sort.by(direction, sortField))
        : PageRequest.of(0, 10, Sort.by(direction, sortField));

    Specification<Property> spec = (root, query, criteriaBuilder) -> {
      // Initialize the default predicate
      Predicate predicate = criteriaBuilder.conjunction();

      // Apply string filters for fields other than price and area
      for (Map.Entry<String, String> entry : filters.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();
        if (value != null && !value.isEmpty() &&
            !key.equals("minPrice") && !key.equals("maxPrice") &&
            !key.equals("minArea") && !key.equals("maxArea")) {
          predicate = criteriaBuilder.and(predicate,
              criteriaBuilder.like(root.get(key).as(String.class), "%" + value + "%"));
        }
      }

      // Filter by price range
      String minPriceStr = filters.get("minPrice");
      String maxPriceStr = filters.get("maxPrice");
      if (minPriceStr != null && !minPriceStr.isEmpty() && maxPriceStr != null && !maxPriceStr.isEmpty()) {
        try {
          double minPrice = Double.parseDouble(minPriceStr);
          double maxPrice = Double.parseDouble(maxPriceStr);
          predicate = criteriaBuilder.and(predicate,
              criteriaBuilder.between(root.get("price"), minPrice, maxPrice));
        } catch (NumberFormatException e) {
          throw new IllegalArgumentException("Invalid price range values");
        }
      }

      // Filter by area range
      String minAreaStr = filters.get("minArea");
      String maxAreaStr = filters.get("maxArea");
      if (minAreaStr != null && !minAreaStr.isEmpty() && maxAreaStr != null && !maxAreaStr.isEmpty()) {
        try {
          double minArea = Double.parseDouble(minAreaStr);
          double maxArea = Double.parseDouble(maxAreaStr);
          predicate = criteriaBuilder.and(predicate,
              criteriaBuilder.between(root.get("area"), minArea, maxArea));
        } catch (NumberFormatException e) {
          throw new IllegalArgumentException("Invalid area range values");
        }
      }

      return predicate;
    };

    return propertyRepository.findAll(spec, pageRequest).getContent();
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

  public Optional<Property> getPropertyById(int propertyId) {
    return propertyRepository.findById(propertyId);
  }

  @Transactional
  public Property createProperty(Property property) {
    // Validate foreign keys exist
    validatePropertyReferences(property);

    // Set default values if needed
    if (property.getStatus() == null) {
      property.setStatus(Property.PropertyStatus.PENDING);
    }

    return propertyRepository.save(property);
  }

  @Transactional
  public Property updateProperty(int propertyId, Property propertyDetails) {
    Property property = propertyRepository.findById(propertyId)
        .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));

    // Validate foreign keys exist
    validatePropertyReferences(propertyDetails);

    // Update fields
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

    // Only update references if they're provided
    if (propertyDetails.getCategory() != null) {
      property.setCategory(propertyDetails.getCategory());
    }

    if (propertyDetails.getUser() != null) {
      property.setUser(propertyDetails.getUser());
    }

    if (propertyDetails.getPropertyLegalDocument() != null) {
      property.setPropertyLegalDocument(propertyDetails.getPropertyLegalDocument());
    }

    return propertyRepository.save(property);
  }

  @Transactional
  public Property updatePropertyStatus(int propertyId, String status) {
    Property property = propertyRepository.findById(propertyId)
        .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));

    try {
      Property.PropertyStatus propertyStatus = Property.PropertyStatus.valueOf(status);
      property.setStatus(propertyStatus);
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid status value. Must be PENDING, APPROVAL, or CANCELED");
    }

    return propertyRepository.save(property);
  }

  @Transactional
  public void deleteProperty(int propertyId) {
    Property property = propertyRepository.findById(propertyId)
        .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));

    // This will cascade delete related entries in houses or lands tables
    // due to the foreign key constraints
    propertyRepository.delete(property);
  }

  private void validatePropertyReferences(Property property) {
    // Check that category exists
    if (property.getCategory() != null && property.getCategory().getId() != null) {
      categoryService.getCategoryById(property.getCategory().getId())
          .orElseThrow(
              () -> new RuntimeException("Category not found with id: " + property.getCategory().getId()));
    } else {
      throw new RuntimeException("Category is required for property");
    }

    // Check that user exists
    if (property.getUser() != null && property.getUser().getId() != null) {
      userService.getUserById(property.getUser().getId())
          .orElseThrow(() -> new RuntimeException("User not found with id: " + property.getUser().getId()));
    } else {
      throw new RuntimeException("User is required for property");
    }

    // Check that legal document exists
    if (property.getPropertyLegalDocument() != null
        && property.getPropertyLegalDocument().getId() != null) {
      propertyLegalDocumentService
          .getPropertyLegalDocumentById(property.getPropertyLegalDocument().getId())
          .orElseThrow(() -> new RuntimeException("Property legal document not found with id: " +
              property.getPropertyLegalDocument().getId()));
    } else {
      throw new RuntimeException("Property legal document is required for property");
    }
  }
}