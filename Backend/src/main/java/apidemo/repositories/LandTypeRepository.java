package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.LandType;

public interface LandTypeRepository extends JpaRepository<LandType, Integer> {

}
