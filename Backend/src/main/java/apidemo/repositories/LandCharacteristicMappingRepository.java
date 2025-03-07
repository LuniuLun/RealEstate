package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.LandCharacteristicMapping;

public interface LandCharacteristicMappingRepository extends JpaRepository<LandCharacteristicMapping, Integer> {

}
