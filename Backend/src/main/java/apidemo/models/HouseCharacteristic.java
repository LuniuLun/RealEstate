
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
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "houseCharacteristic")
  @JsonIgnore
  private Set<HouseCharacteristicMapping> houseCharacteristicMappings;

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

  public Set<HouseCharacteristicMapping> getHouseCharacteristicMappings() {
    return houseCharacteristicMappings;
  }

  public void setHouseCharacteristicMappings(Set<HouseCharacteristicMapping> houseCharacteristicMappings) {
    this.houseCharacteristicMappings = houseCharacteristicMappings;
  }
}