package apidemo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import apidemo.models.Property;
import apidemo.models.Property.PropertyStatus;

public interface PropertyRepository extends JpaRepository<Property, Integer>, JpaSpecificationExecutor<Property> {
  List<Property> findByUser_id(int id);

  List<Property> findByCategory_id(int id);

  List<Property> findByStatus(PropertyStatus status);

  long countByUser_id(int id);

  long countByStatus(PropertyStatus status);

  long countByStatusAndCategory_id(PropertyStatus status, int categoryId);

  long countByStatusAndUser_id(PropertyStatus status, int userId);
}