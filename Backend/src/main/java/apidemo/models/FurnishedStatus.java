package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "furnished_statuses")
public class FurnishedStatus {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "furnished_status_id")
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "furnishedStatus")
  @JsonIgnore
  private Set<House> houses;

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

  public Set<House> getHouses() {
    return houses;
  }

  public void setHouses(Set<House> houses) {
    this.houses = houses;
  }
}