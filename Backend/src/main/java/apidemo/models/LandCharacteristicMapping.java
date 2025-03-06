package apidemo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "land_characteristic_mappings")
public class LandCharacteristicMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "land_characteristic_mapping_id")
  private Integer landCharacteristicMappingId;

  @ManyToOne
  @JoinColumn(name = "land_id", nullable = false)
  @JsonIgnore
  private Land land;

  @ManyToOne
  @JoinColumn(name = "land_characteristic_id", nullable = false)
  @JsonBackReference
  private LandCharacteristic landCharacteristic;

  // Getters and Setters
  public Integer getLandCharacteristicMappingId() {
    return landCharacteristicMappingId;
  }

  public void setLandCharacteristicMappingId(Integer landCharacteristicMappingId) {
    this.landCharacteristicMappingId = landCharacteristicMappingId;
  }

  public Land getLand() {
    return land;
  }
}