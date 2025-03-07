package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.LandCharacteristic;

public interface LandCharacteristicRepository extends JpaRepository<LandCharacteristic, Integer> {

}
