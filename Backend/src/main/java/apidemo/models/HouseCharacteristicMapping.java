
package apidemo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "house_characteristic_mappings")
public class HouseCharacteristicMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "house_characteristic_mapping_id")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "house_id", nullable = false)
  @JsonIgnore
  private House house;

  @ManyToOne
  @JoinColumn(name = "house_characteristic_id", nullable = false)
  private HouseCharacteristic houseCharacteristic;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
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
