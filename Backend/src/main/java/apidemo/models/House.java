
package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "houses")
public class House {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "house_id")
  private Integer id;

  @OneToOne
  @JoinColumn(name = "property_id", nullable = false)
  @JsonIgnore
  private Property property;

  @Column(nullable = false)
  private Integer bedrooms;

  @Column(nullable = false)
  private Integer floors;

  @Column(nullable = false)
  private Integer toilets;

  @ManyToOne
  @JoinColumn(name = "furnished_status_id", nullable = false)
  private FurnishedStatus furnishedStatus;

  @ManyToOne
  @JoinColumn(name = "house_type_id", nullable = false)
  private HouseType houseType;

  @OneToMany(mappedBy = "house", cascade = CascadeType.ALL)
  private Set<HouseCharacteristicMapping> houseCharacteristicMappings;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Property getProperty() {
    return property;
  }

  public void setProperty(Property property) {
    this.property = property;
  }

  public Integer getBedrooms() {
    return bedrooms;
  }

  public void setBedrooms(Integer bedrooms) {
    this.bedrooms = bedrooms;
  }

  public Integer getToilets() {
    return toilets;
  }

  public void setToilets(Integer toilets) {
    this.toilets = toilets;
  }

  public Integer getFloors() {
    return floors; // Fixed: changed from toilets to floors
  }

  public void setFloors(Integer floors) {
    this.floors = floors;
  }

  public FurnishedStatus getFurnishedStatus() {
    return furnishedStatus;
  }

  public void setFurnishedStatus(FurnishedStatus furnishedStatus) {
    this.furnishedStatus = furnishedStatus;
  }

  public HouseType getHouseType() {
    return houseType;
  }

  public void setHouseType(HouseType houseType) {
    this.houseType = houseType;
  }

  public Set<HouseCharacteristicMapping> getHouseCharacteristicMappings() {
    return houseCharacteristicMappings;
  }

  public void setHouseCharacteristicMappings(Set<HouseCharacteristicMapping> houseCharacteristicMappings) {
    this.houseCharacteristicMappings = houseCharacteristicMappings;
  }
}