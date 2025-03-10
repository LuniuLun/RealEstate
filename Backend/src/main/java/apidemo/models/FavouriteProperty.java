
package apidemo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "favourite_properties")
public class FavouriteProperty {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "favourite_property_id")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "property_id", nullable = false)
  private Property property;

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Property getProperty() {
    return property;
  }

  public void setProperty(Property property) {
    this.property = property;
  }
}