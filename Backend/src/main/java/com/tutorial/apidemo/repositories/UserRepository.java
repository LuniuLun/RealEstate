package com.tutorial.apidemo.repositories;

import com.tutorial.apidemo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {

  User findByUsername(String username);

  User findByEmail(String email);

  User findByPhone(String phone);
}
