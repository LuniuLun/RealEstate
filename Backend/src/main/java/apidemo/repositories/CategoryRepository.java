package apidemo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
  Optional<Category> findByName(String name);
}
