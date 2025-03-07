package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.HouseCharacteristic;

public interface HouseCharacteristicRepository extends JpaRepository<HouseCharacteristic, Integer> {

}
