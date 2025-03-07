package apidemo.services;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import apidemo.models.Role;
import apidemo.models.Token;
import apidemo.models.User;
import apidemo.repositories.RoleRepository;
import apidemo.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final TokenService tokenService;

  public UserService(UserRepository userRepository, RoleRepository roleRepository, TokenService tokenService) {
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  public List<User> getAllUsers(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    // Provide a default sort field if sortBy is null or empty
    String sortField = (sortBy == null || sortBy.isEmpty()) ? "userId" : sortBy;

    Sort.Direction direction = ("asc".equalsIgnoreCase(typeOfSort)) ? Sort.Direction.ASC : Sort.Direction.DESC;
    Pageable pageRequest = (limit != null && page != null)
        ? PageRequest.of(page - 1, limit, Sort.by(direction, sortField))
        : PageRequest.of(0, 10, Sort.by(direction, sortField));

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

  public Optional<User> getUserById(Integer userId) {
    return userRepository.findById(userId);
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

  public Optional<Token> login(String username, String password) {
    try {
      Optional<User> user = userRepository.findByUsername(username);
      if (user.isPresent() && user.get().getPassword().equals(password)) {
        User currentUser = user.get();

        // Check and get valid token
        Optional<Token> validToken = tokenService.getValidTokenForUser(currentUser.getId());
        if (validToken.isPresent()) {
          return validToken;
        }

        // Create new token if there is no valid token
        Token newToken = tokenService.createTokenForUser(currentUser);
        return Optional.of(newToken);
      }
    } catch (Exception e) {
      throw new RuntimeException("An error occurred during login: " + e.getMessage(), e);
    }
    return Optional.empty();
  }

}