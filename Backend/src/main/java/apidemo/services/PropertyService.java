package apidemo.services;

import java.util.Map;

public class PropertyService {

  private final PropertyMLService propertyMLService;

  public PropertyService() {
    this.propertyMLService = new PropertyMLService();
  }

  public double getEstimatedPrice(Map<String, Double> propertyFeatures) {
    return propertyMLService.estimatePropertyPrice(propertyFeatures);
  }
}
