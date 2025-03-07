
package apidemo.models;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "land_types")
public class LandType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "land_type_id")
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "landType")
  @JsonIgnore
  private Set<Land> lands;

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

  public Set<Land> getLands() {
    return lands;
  }

  public void setLands(Set<Land> lands) {
    this.lands = lands;
  }
}
