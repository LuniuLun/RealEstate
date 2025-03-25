package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.HouseType;

public interface HouseTypeRepository extends JpaRepository<HouseType, Integer> {

}
