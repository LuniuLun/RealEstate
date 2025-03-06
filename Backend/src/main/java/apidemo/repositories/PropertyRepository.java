package apidemo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import apidemo.models.Property;

public interface PropertyRepository extends JpaRepository<Property, Integer>, JpaSpecificationExecutor<Property> {
  List<Property> findByUser_UserId(int userId);

  List<Property> findByCategory_CategoryId(int categoryId);

  List<Property> findByStatus(String status);
}
