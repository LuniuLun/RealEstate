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
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "land_id", nullable = false)
  @JsonIgnore
  private Land land;

  @ManyToOne
  @JoinColumn(name = "land_characteristic_id", nullable = false)
  @JsonBackReference
  private LandCharacteristic landCharacteristic;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Land getLand() {
    return land;
  }

  public void setLand(Land land) {
    this.land = land;
  }

  public LandCharacteristic getLandCharacteristic() {
    return landCharacteristic;
  }

  public void setLandCharacteristic(LandCharacteristic landCharacteristic) {
    this.landCharacteristic = landCharacteristic;
  }
}