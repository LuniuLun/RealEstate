package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.HouseCharacteristicMapping;

public interface HouseCharacteristicMappingRepository extends JpaRepository<HouseCharacteristicMapping, Integer> {

}
