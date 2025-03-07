package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "land_characteristics")
public class LandCharacteristic {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "land_characteristic_id")
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "landCharacteristic")
  @JsonIgnore
  private Set<LandCharacteristicMapping> landCharacteristicMappings;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<LandCharacteristicMapping> getLandCharacteristicMappings() {
    return landCharacteristicMappings;
  }

  public void setLandCharacteristicMappings(Set<LandCharacteristicMapping> landCharacteristicMappings) {
    this.landCharacteristicMappings = landCharacteristicMappings;
  }
}