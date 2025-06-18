package apidemo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import apidemo.models.User;

public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {

  Optional<User> findByEmail(String email);

  Optional<User> findByPhone(String phone);

  boolean existsByEmailAndIdNot(String email, Integer id);

  boolean existsByPhoneAndIdNot(String phone, Integer id);
}
