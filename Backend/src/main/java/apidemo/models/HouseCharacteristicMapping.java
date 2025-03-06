
package apidemo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "house_characteristic_mappings")
public class HouseCharacteristicMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "house_characteristic_mapping_id")
  private Integer houseCharacteristicMappingId;

  @ManyToOne
  @JoinColumn(name = "house_id", nullable = false)
  @JsonIgnore
  private House house;

  @ManyToOne
  @JoinColumn(name = "house_characteristic_id", nullable = false)
  @JsonBackReference
  private HouseCharacteristic houseCharacteristic;

  // Getters and Setters
  public Integer getHouseCharacteristicMappingId() {
    return houseCharacteristicMappingId;
  }

  public void setHouseCharacteristicMappingId(Integer houseCharacteristicMappingId) {
    this.houseCharacteristicMappingId = houseCharacteristicMappingId;
  }

  public House getHouse() {
    return house;
  }

  public void setHouse(House house) {
    this.house = house;
  }

  public HouseCharacteristic getHouseCharacteristic() {
    return houseCharacteristic;
  }

  public void setHouseCharacteristic(HouseCharacteristic houseCharacteristic) {
    this.houseCharacteristic = houseCharacteristic;
  }
}
