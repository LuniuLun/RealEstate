package apidemo.controllers;

import apidemo.services.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/property")
public class PropertyController {

  private final PropertyService propertyService;

  public PropertyController() {
    this.propertyService = new PropertyService();
  }

  @PostMapping("/estimate-price")
  public double estimatePropertyPrice(@RequestBody Map<String, Double> propertyFeatures) {
    return propertyService.getEstimatedPrice(propertyFeatures);
  }
}
