package apidemo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.PropertyLegalDocument;

public interface PropertyLegalDocumentRepository extends JpaRepository<PropertyLegalDocument, Integer> {
  Optional<PropertyLegalDocument> findByName(String name);
}
