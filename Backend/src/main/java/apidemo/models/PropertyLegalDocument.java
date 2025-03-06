package apidemo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "property_legal_documents")
public class PropertyLegalDocument {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "property_legal_document_id")
  private Integer propertyLegalDocumentId;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "propertyLegalDocument")
  @JsonIgnore // Prevents recursive serialization
  private Set<Property> properties;

  // Getters and Setters
  public Integer getPropertyLegalDocumentId() {
    return propertyLegalDocumentId;
  }

  public void setPropertyLegalDocumentId(Integer propertyLegalDocumentId) {
    this.propertyLegalDocumentId = propertyLegalDocumentId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<Property> getProperties() {
    return properties;
  }

  public void setProperties(Set<Property> properties) {
    this.properties = properties;
  }
}
