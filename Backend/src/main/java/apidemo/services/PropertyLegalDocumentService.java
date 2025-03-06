package apidemo.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apidemo.models.PropertyLegalDocument;
import apidemo.repositories.PropertyLegalDocumentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyLegalDocumentService {

  private final PropertyLegalDocumentRepository propertyLegalDocumentRepository;

  public PropertyLegalDocumentService(PropertyLegalDocumentRepository propertyLegalDocumentRepository) {
    this.propertyLegalDocumentRepository = propertyLegalDocumentRepository;
  }

  public List<PropertyLegalDocument> getAllPropertyLegalDocuments() {
    return propertyLegalDocumentRepository.findAll();
  }

  public Optional<PropertyLegalDocument> getPropertyLegalDocumentById(int documentId) {
    return propertyLegalDocumentRepository.findById(documentId);
  }

  public Optional<PropertyLegalDocument> getPropertyLegalDocumentByName(String name) {
    return propertyLegalDocumentRepository.findByName(name);
  }

  @Transactional
  public PropertyLegalDocument createPropertyLegalDocument(PropertyLegalDocument document) {
    return propertyLegalDocumentRepository.save(document);
  }

  @Transactional
  public PropertyLegalDocument updatePropertyLegalDocument(int documentId, PropertyLegalDocument documentDetails) {
    PropertyLegalDocument document = propertyLegalDocumentRepository.findById(documentId)
        .orElseThrow(() -> new RuntimeException("Property legal document not found with id: " + documentId));

    document.setName(documentDetails.getName());

    return propertyLegalDocumentRepository.save(document);
  }

  @Transactional
  public void deletePropertyLegalDocument(int documentId) {
    PropertyLegalDocument document = propertyLegalDocumentRepository.findById(documentId)
        .orElseThrow(() -> new RuntimeException("Property legal document not found with id: " + documentId));

    propertyLegalDocumentRepository.delete(document);
  }
}