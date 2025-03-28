
package apidemo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "properties")
public class Property {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "property_id")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PropertyStatus status = PropertyStatus.PENDING;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false, length = 50)
  private String region;

  @Column(name = "district_name", nullable = false, length = 50)
  private String districtName;

  @Column(name = "ward_name", nullable = false, length = 50)
  private String wardName;

  @Column(name = "street_name", nullable = false, length = 100)
  private String streetName;

  @Column(nullable = false)
  private Double longitude;

  @Column(nullable = false)
  private Double latitude;

  @ManyToOne
  @JoinColumn(name = "property_legal_document_id", nullable = false)
  private PropertyLegalDocument propertyLegalDocument;

  @Column(nullable = false)
  private Integer direction;

  @Column(nullable = false)
  private Double area;

  @Column(nullable = false)
  private Double length;

  @Column(nullable = false)
  private Double width;

  @Column(columnDefinition = "TEXT")
  private String images;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal price;

  @Column(name = "created_at", nullable = false, updatable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime updatedAt;

  @OneToOne(mappedBy = "property", cascade = CascadeType.ALL)
  private House house;

  @OneToOne(mappedBy = "property", cascade = CascadeType.ALL)
  private Land land;

  @OneToMany(mappedBy = "property", cascade = CascadeType.REMOVE)
  @JsonIgnore
  private Set<FavouriteProperty> favouriteProperties;

  public enum PropertyStatus {
    PENDING, APPROVAL, CANCELED
  }

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
  }

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

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public PropertyStatus getStatus() {
    return status;
  }

  public void setStatus(PropertyStatus status) {
    this.status = status;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getRegion() {
    return region;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public String getDistrictName() {
    return districtName;
  }

  public void setDistrictName(String districtName) {
    this.districtName = districtName;
  }

  public String getWardName() {
    return wardName;
  }

  public void setWardName(String wardName) {
    this.wardName = wardName;
  }

  public String getStreetName() {
    return streetName;
  }

  public void setStreetName(String streetName) {
    this.streetName = streetName;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public PropertyLegalDocument getPropertyLegalDocument() {
    return propertyLegalDocument;
  }

  public void setPropertyLegalDocument(PropertyLegalDocument propertyLegalDocument) {
    this.propertyLegalDocument = propertyLegalDocument;
  }

  public Integer getDirection() {
    return direction;
  }

  public void setDirection(Integer direction) {
    this.direction = direction;
  }

  public Double getArea() {
    return area;
  }

  public void setArea(Double area) {
    this.area = area;
  }

  public Double getLength() {
    return length;
  }

  public void setLength(Double length) {
    this.length = length;
  }

  public Double getWidth() {
    return width;
  }

  public void setWidth(Double width) {
    this.width = width;
  }

  public String getImages() {
    return images;
  }

  public void setImages(String images) {
    this.images = images;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public House getHouse() {
    return house;
  }

  public void setHouse(House house) {
    this.house = house;
  }

  public Land getLand() {
    return land;
  }

  public void setLand(Land land) {
    this.land = land;
  }

  public Set<FavouriteProperty> getFavouriteProperties() {
    return favouriteProperties;
  }

  public void setFavouriteProperties(Set<FavouriteProperty> favouriteProperties) {
    this.favouriteProperties = favouriteProperties;
  }
}