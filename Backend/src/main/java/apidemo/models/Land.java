
package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lands")
public class Land {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "land_id")
  private Integer landId;

  @OneToOne(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "property_id", nullable = false)
  @JsonIgnore
  private Property property;

  @ManyToOne
  @JoinColumn(name = "land_type_id", nullable = false)
  private LandType landType;

  @OneToMany(mappedBy = "land")
  private Set<LandCharacteristicMapping> landCharacteristicMappings;

  // Getters and Setters
  public Integer getLandId() {
    return landId;
  }

  public void setLandId(Integer landId) {
    this.landId = landId;
  }

  public Property getProperty() {
    return property;
  }

  public void setProperty(Property property) {
    this.property = property;
  }

  public LandType getLandType() {
    return landType;
  }

  public void setLandType(LandType landType) {
    this.landType = landType;
  }

  public Set<LandCharacteristicMapping> getLandCharacteristicMappings() {
    return landCharacteristicMappings;
  }

  public void setLandCharacteristicMappings(Set<LandCharacteristicMapping> landCharacteristicMappings) {
    this.landCharacteristicMappings = landCharacteristicMappings;
  }
}