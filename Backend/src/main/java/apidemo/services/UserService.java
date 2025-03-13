package apidemo.services;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import apidemo.models.Role;
import apidemo.models.User;
import apidemo.repositories.RoleRepository;
import apidemo.repositories.UserRepository;
import apidemo.utils.Filter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final Filter filter = new Filter();
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, RoleRepository roleRepository,
      PasswordEncoder passwordEncoder) {
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<User> getAllUsers(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    // Configure pagination and sorting
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    Specification<User> spec = (root, query, criteriaBuilder) -> {
      Predicate predicate = criteriaBuilder.conjunction();
      for (Map.Entry<String, String> entry : filters.entrySet()) {
        if (entry.getValue() != null && !entry.getValue().isEmpty()) {
          predicate = criteriaBuilder.and(predicate,
              criteriaBuilder.like(root.get(entry.getKey()).as(String.class), "%" + entry.getValue() + "%"));
        }
      }
      return predicate;
    };

    return userRepository.findAll(spec, pageRequest).getContent();
  }

  public User getUserById(Integer userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User does not exist"));
  }

  public User getUserByUsername(String username) {
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User does not exist"));
  }

  public User createUser(User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
      throw new RuntimeException("Username " + user.getUsername() + " is already taken.");
    }
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new RuntimeException("Email " + user.getEmail() + " is already taken.");
    }
    if (userRepository.findByPhone(user.getPhone()).isPresent()) {
      throw new RuntimeException("Phone " + user.getPhone() + " is already taken.");
    }
    Role role = roleRepository.findById(user.getRole().getId())
        .orElseThrow(() -> new RuntimeException("Role not found with id: " + user.getRole().getId()));

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole(role);
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());

    return userRepository.save(user);
  }

  public User upgradeUser(Integer userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User does not exist"));

    if (user.getRole().getName() == Role.RoleName.BROKER) {
      throw new RuntimeException("Your account has been upgraded");
    }

    Role brokerRole = roleRepository.findById(2)
        .orElseThrow(() -> new RuntimeException("Role BROKER not found"));

    user.setRole(brokerRole);
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
          .orElseThrow(() -> new RuntimeException("Role does not exist"));
      existingUser.setRole(role);

      return userRepository.save(existingUser);
    }).orElseThrow(() -> new RuntimeException("User does not exist"));
  }

  public void deleteUser(Integer userId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User does not exist");
    }
    userRepository.deleteById(userId);
  }
}