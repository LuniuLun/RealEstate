package apidemo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.FavouriteProperty;

public interface FavouritePropertyRepository extends JpaRepository<FavouriteProperty, Integer> {

  Optional<FavouriteProperty> findByUserIdAndPropertyId(Integer userId, Integer propertyId);

  List<FavouriteProperty> findByUserId(Integer userId);
}
