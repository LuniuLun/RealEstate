package apidemo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apidemo.models.Property;
import apidemo.services.PropertyService;

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
  public List<Property> getAllProperties(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {

    filters.remove("page");
    filters.remove("limit");
    filters.remove("sortBy");
    filters.remove("typeOfSort");

    return propertyService.getAllProperties(limit, page, sortBy, typeOfSort, filters);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Property> getPropertyById(@PathVariable Integer id) {
    return propertyService.getPropertyById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> createProperty(@RequestBody Property property) {
    try {
      return ResponseEntity.ok(propertyService.createProperty(property));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/estimate-price")
  public double estimatePropertyPrice(@RequestBody Map<String, Double> propertyFeatures) {
    return propertyService.getEstimatedPrice(propertyFeatures);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Property> updateProperty(@PathVariable Integer id, @RequestBody Property updatedProperty) {
    try {
      return ResponseEntity.ok(propertyService.updateProperty(id, updatedProperty));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProperty(@PathVariable Integer id) {
    try {
      propertyService.deleteProperty(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
    return ResponseEntity.status(500).body(Map.of("message", ex.getMessage()));
  }
}