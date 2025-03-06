
package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "house_characteristics")
public class HouseCharacteristic {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "house_characteristic_id")
  private Integer houseCharacteristicId;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "houseCharacteristic")
  @JsonIgnore
  private Set<HouseCharacteristicMapping> houseCharacteristicMappings;

  // Getters and Setters
  public Integer getHouseCharacteristicId() {
    return houseCharacteristicId;
  }

  public void setHouseCharacteristicId(Integer houseCharacteristicId) {
    this.houseCharacteristicId = houseCharacteristicId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<HouseCharacteristicMapping> getHouseCharacteristicMappings() {
    return houseCharacteristicMappings;
  }

  public void setHouseCharacteristicMappings(Set<HouseCharacteristicMapping> houseCharacteristicMappings) {
    this.houseCharacteristicMappings = houseCharacteristicMappings;
  }
}