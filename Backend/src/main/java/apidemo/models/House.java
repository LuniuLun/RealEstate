
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
  private Integer houseId;

  @OneToOne(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "property_id", nullable = false)
  @JsonIgnore
  private Property property;

  @Column(nullable = false)
  private Integer bedrooms;

  @Column(nullable = false)
  private Integer toilets;

  @ManyToOne
  @JoinColumn(name = "furnished_status_id", nullable = false)
  private FurnishedStatus furnishedStatus;

  @OneToMany(mappedBy = "house")
  private Set<HouseCharacteristicMapping> houseCharacteristicMappings;

  // Getters and Setters
  public Integer getHouseId() {
    return houseId;
  }

  public void setHouseId(Integer houseId) {
    this.houseId = houseId;
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

  public FurnishedStatus getFurnishedStatus() {
    return furnishedStatus;
  }

  public void setFurnishedStatus(FurnishedStatus furnishedStatus) {
    this.furnishedStatus = furnishedStatus;
  }

  public Set<HouseCharacteristicMapping> getHouseCharacteristicMappings() {
    return houseCharacteristicMappings;
  }

  public void setHouseCharacteristicMappings(Set<HouseCharacteristicMapping> houseCharacteristicMappings) {
    this.houseCharacteristicMappings = houseCharacteristicMappings;
  }
}