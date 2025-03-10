package apidemo.controllers;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apidemo.models.Property;
import apidemo.services.PropertyService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

  private final PropertyService propertyService;

  public PropertyController(PropertyService propertyService) {
    this.propertyService = propertyService;
  }

  @GetMapping
  public ResponseEntity<?> getAllProperties(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      filters.remove("page");
      filters.remove("limit");
      filters.remove("sortBy");
      filters.remove("typeOfSort");

      List<Property> properties = propertyService.getAllProperties(limit, page, sortBy, typeOfSort, filters);
      return ResponseEntity.ok(properties);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(errorResponse);
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
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping
  public ResponseEntity<?> createProperty(@RequestBody Property property) {
    try {
      Property createdProperty = propertyService.createProperty(property);
      return ResponseEntity.ok(createdProperty);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PostMapping("/estimate-price")
  public ResponseEntity<?> estimatePropertyPrice(@RequestBody Map<String, Double> propertyFeatures) {
    try {
      double estimatedPrice = propertyService.getEstimatedPrice(propertyFeatures);
      return ResponseEntity.ok(Map.of("estimatedPrice", estimatedPrice));
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateProperty(@PathVariable Integer id, @RequestBody Property updatedProperty) {
    try {
      Property updated = propertyService.updateProperty(id, updatedProperty);
      return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteProperty(@PathVariable Integer id) {
    try {
      propertyService.deleteProperty(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
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
    return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}
