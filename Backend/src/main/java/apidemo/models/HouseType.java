package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "house_type")
public class HouseType {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "house_type_id")
  private Integer id;

  @Column(name = "house_type_name", nullable = false)
  private String housTypeName;

  @OneToMany(mappedBy = "houseType")
  @JsonIgnore
  private Set<House> houses;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getHousTypeName() {
    return housTypeName;
  }

  public void setHousTypeName(String housTypeName) {
    this.housTypeName = housTypeName;
  }

  public Set<House> getHouses() {
    return houses;
  }

  public void setHouses(Set<House> houses) {
    this.houses = houses;
  }
}
