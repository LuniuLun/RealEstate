package apidemo.repositories;

import apidemo.models.FavouriteProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavouritePropertyRepository
    extends JpaRepository<FavouriteProperty, Integer>, JpaSpecificationExecutor<FavouriteProperty> {
  List<FavouriteProperty> findByUserId(Integer userId);

  Optional<FavouriteProperty> findByUserIdAndPropertyId(Integer userId, Integer propertyId);
}