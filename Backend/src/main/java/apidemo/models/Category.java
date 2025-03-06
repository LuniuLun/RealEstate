package apidemo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "categories")
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private Integer categoryId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private CategoryName name;

  @OneToMany(mappedBy = "category")
  @JsonIgnore // Prevent cyclic serialization
  private Set<Property> properties;

  public enum CategoryName {
    LAND, HOUSE
  }

  // Getters and Setters
  public Integer getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Integer categoryId) {
    this.categoryId = categoryId;
  }

  public CategoryName getName() {
    return name;
  }

  public void setName(CategoryName name) {
    this.name = name;
  }

  public Set<Property> getProperties() {
    return properties;
  }

  public void setProperties(Set<Property> properties) {
    this.properties = properties;
  }
}
