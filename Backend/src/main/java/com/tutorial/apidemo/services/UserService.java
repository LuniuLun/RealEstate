package com.tutorial.apidemo.services;

import com.tutorial.apidemo.models.Role;
import com.tutorial.apidemo.models.User;
import com.tutorial.apidemo.repositories.RoleRepository;
import com.tutorial.apidemo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;

  @Autowired
  public UserService(UserRepository userRepository, RoleRepository roleRepository) {
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(Integer userId) {
    return userRepository.findById(userId);
  }

  public User createUser(User user) {
    if (userRepository.findByUsername(user.getUsername()) != null) {
      throw new RuntimeException("Username " + user.getUsername() + " is already taken.");
    }
    if (userRepository.findByEmail(user.getEmail()) != null) {
      throw new RuntimeException("Email " + user.getEmail() + " is already taken.");
    }
    if (userRepository.findByPhone(user.getPhone()) != null) {
      throw new RuntimeException("Phone " + user.getPhone() + " is already taken.");
    }
    Role role = roleRepository.findById(user.getRole().getId())
        .orElseThrow(() -> new RuntimeException("Role not found with id: " + user.getRole().getId()));

    user.setRole(role);
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());

    return userRepository.save(user);
  }

  public User updateUser(Integer userId, User updatedUser) {
    return userRepository.findById(userId).map(existingUser -> {
      existingUser.setUsername(updatedUser.getUsername());
      existingUser.setEmail(updatedUser.getEmail());
      existingUser.setPassword(updatedUser.getPassword());
      existingUser.setPhone(updatedUser.getPhone());
      existingUser.setAddress(updatedUser.getAddress());
      existingUser.setRole(updatedUser.getRole());
      existingUser.setUpdatedAt(LocalDateTime.now());

      Role role = roleRepository.findById(existingUser.getRole().getId())
          .orElseThrow(() -> new RuntimeException("Role not found with id: " + existingUser.getRole().getId()));
      existingUser.setRole(role);

      return userRepository.save(existingUser);
    }).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
  }

  public void deleteUser(Integer userId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User not found with id: " + userId);
    }
    userRepository.deleteById(userId);
  }
}