package apidemo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import apidemo.models.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
