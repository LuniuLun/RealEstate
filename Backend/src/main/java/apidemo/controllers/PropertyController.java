package apidemo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import apidemo.models.Property;
import apidemo.models.Property.PropertyStatus;
import apidemo.models.Role.RoleName;
import apidemo.models.User;
import apidemo.services.FirebaseFileService;
import apidemo.services.PropertyService;
import apidemo.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

  private final FirebaseFileService storageService;
  private final PropertyService propertyService;
  private final UserService userService;

  public PropertyController(PropertyService propertyService, FirebaseFileService storageService,
      UserService userService) {
    this.propertyService = propertyService;
    this.storageService = storageService;
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<?> getAllProperties(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      if (filters != null) {
        filters.remove("page");
        filters.remove("limit");
        filters.remove("sortBy");
        filters.remove("typeOfSort");
      }

      Map<String, Object> result = propertyService.getAllProperties(limit, page, sortBy, typeOfSort, filters);
      return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<?> getUserProperties(
      @PathVariable Integer userId,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      if (filters != null) {
        filters.remove("page");
        filters.remove("limit");
        filters.remove("sortBy");
        filters.remove("typeOfSort");
      }

      Map<String, Object> result = propertyService.getPropertiesByUser(userId, limit, page, sortBy, typeOfSort,
          filters);
      return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getPropertyById(@PathVariable Integer id) {
    try {
      Property property = propertyService.getPropertyById(id);
      return ResponseEntity.ok(property);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  /**
   * API endpoint để lấy số lượng bài viết theo từng trạng thái
   * 
   * @return Map chứa số lượng bài viết theo các trạng thái
   */
  @GetMapping("/counts")
  public ResponseEntity<?> getPropertyCounts() {
    try {
      Map<String, Long> counts = new HashMap<>();
      counts.put("pending", propertyService.getCountPropertiesByStatus(PropertyStatus.PENDING));
      counts.put("approved", propertyService.getCountPropertiesByStatus(PropertyStatus.APPROVAL));
      counts.put("canceled", propertyService.getCountPropertiesByStatus(PropertyStatus.CANCELED));

      return ResponseEntity.ok(counts);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/counts/user/{userId}")
  public ResponseEntity<?> getPropertyCountsByUser(@PathVariable int userId) {
    try {
      Map<String, Long> counts = new HashMap<>();
      counts.put("pending", propertyService.getCountPropertiesByUserAndStatus(userId, PropertyStatus.PENDING));
      counts.put("approved", propertyService.getCountPropertiesByUserAndStatus(userId, PropertyStatus.APPROVAL));
      counts.put("canceled", propertyService.getCountPropertiesByUserAndStatus(userId, PropertyStatus.CANCELED));

      return ResponseEntity.ok(counts);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  /**
   * API endpoint để lấy số lượng bài viết theo trạng thái cụ thể
   * 
   * @param status Trạng thái cần đếm (PENDING, APPROVAL, CANCELED)
   * @return Số lượng bài viết
   */
  @GetMapping("/counts/{status}")
  public ResponseEntity<?> getPropertyCountByStatusFromCounts(@PathVariable String status) {
    try {
      Property.PropertyStatus propertyStatus = Property.PropertyStatus.valueOf(status.toUpperCase());
      long count = propertyService.getCountPropertiesByStatus(propertyStatus);

      Map<String, Long> result = new HashMap<>();
      result.put("count", count);

      return ResponseEntity.ok(result);
    } catch (IllegalArgumentException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", "Invalid status value. Must be PENDING, APPROVAL, or CANCELED");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  /**
   * API endpoint để lấy số lượng bài viết theo trạng thái và danh mục
   * 
   * @param status     Trạng thái cần đếm (PENDING, APPROVAL, CANCELED)
   * @param categoryId ID của danh mục
   * @return Số lượng bài viết
   */
  @GetMapping("/count/{status}/category/{categoryId}")
  public ResponseEntity<?> getPropertyCountByStatusAndCategory(
      @PathVariable String status,
      @PathVariable Integer categoryId) {
    try {
      Property.PropertyStatus propertyStatus = Property.PropertyStatus.valueOf(status.toUpperCase());
      long count = propertyService.getCountPropertiesByStatusAndCategory(propertyStatus, categoryId);

      Map<String, Long> result = new HashMap<>();
      result.put("count", count);

      return ResponseEntity.ok(result);
    } catch (IllegalArgumentException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", "Invalid status value. Must be PENDING, APPROVAL, or CANCELED");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @PostMapping
  public ResponseEntity<?> createProperty(
      @RequestParam("images") MultipartFile[] images,
      @RequestParam("propertyData") String propertyDataJson) {
    try {
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new JavaTimeModule());
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

      Property property = mapper.readValue(propertyDataJson, Property.class);

      List<String> uploadedUrls = storageService.storeMultiFile(images);

      if (!uploadedUrls.isEmpty()) {
        String imageUrlsString = String.join(",", uploadedUrls);
        property.setImages(imageUrlsString);
      }

      User currentUser = getCurrentUser();
      property.setUser(userService.getUserById(currentUser.getId()));

      Property createdProperty = propertyService.createProperty(property);

      return ResponseEntity.ok(createdProperty);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PostMapping("/estimate-price")
  public ResponseEntity<?> estimatePropertyPrice(@RequestBody Property property) {
    try {

      double estimatedPrice = propertyService.getEstimatedPrice(property);
      return ResponseEntity.ok(Map.of("estimatedPrice", estimatedPrice));
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateProperty(
      @PathVariable Integer id,
      @RequestParam(value = "images", required = false) MultipartFile[] images,
      @RequestParam("propertyData") String propertyDataJson) {
    try {
      // Parse property data from JSON
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new JavaTimeModule());
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
      Property updatedProperty = mapper.readValue(propertyDataJson, Property.class);

      // Get current user and existing property
      User currentUser = getCurrentUser();
      Property existingProperty = propertyService.getPropertyById(id);

      // Check if user is authorized to update the property
      if (!existingProperty.getUser().getId().equals(currentUser.getId())) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "You are not authorized to update this property");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      // Handle images
      List<String> finalImagesList = storageService.updateMultiFile(existingProperty.getImages(),
          updatedProperty.getImages(), images);

      // Set the final list of images
      String imageUrlsString = String.join(",", finalImagesList);
      updatedProperty.setImages(imageUrlsString);

      // Update the property
      Property updated = propertyService.updateProperty(id, updatedProperty);
      return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateArticleStatus(
      @PathVariable Integer id,
      @RequestParam String status) {
    try {
      User currentUser = getCurrentUser();

      // Check if user is an admin
      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Only administrators can update article status");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      Property updatedProperty = propertyService.updatePropertyStatus(id, status);
      return ResponseEntity.ok(updatedProperty);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteProperty(@PathVariable Integer id) {
    try {
      User currentUser = getCurrentUser();

      Property existingProperty = propertyService.getPropertyById(id);

      // Check if user is authorized to delete the property
      if (!existingProperty.getUser().getId().equals(currentUser.getId())) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "You are not authorized to delete this property");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      propertyService.deleteProperty(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.badRequest().body(errorResponse);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  // Helper method to get current authenticated user
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new RuntimeException("Not authenticated");
    }
    return (User) authentication.getPrincipal();
  }
}