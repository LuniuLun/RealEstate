package com.tutorial.apidemo.repositories;

import com.tutorial.apidemo.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
