package apidemo.services;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import apidemo.models.Role;
import apidemo.models.Role.RoleName;
import apidemo.models.User;
import apidemo.repositories.RoleRepository;
import apidemo.repositories.UserRepository;
import apidemo.utils.Filter;

import java.time.LocalDateTime;
import java.util.HashMap;
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

  public Map<String, Object> getAllUsers(Integer limit, Integer page, String sortBy, String typeOfSort,
      Map<String, String> filters) {
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    Map<String, String> filtersCopy = new HashMap<>(filters);
    String searchQuery = filtersCopy.get("searchQuery");

    Specification<User> spec = (root, query, criteriaBuilder) -> {
      Join<User, Role> roleJoin = root.join("role", JoinType.INNER);

      Predicate predicate = criteriaBuilder.notEqual(roleJoin.get("name"), RoleName.ADMIN.toString());

      if (searchQuery != null && !searchQuery.isEmpty()) {
        String likePattern = "%" + searchQuery + "%";
        Predicate searchPredicate = criteriaBuilder.or(
            criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), likePattern.toLowerCase()),
            criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), likePattern.toLowerCase()),
            criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), likePattern.toLowerCase()));
        predicate = criteriaBuilder.and(predicate, searchPredicate);
      }

      for (Map.Entry<String, String> entry : filtersCopy.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();

        if (!key.equals("searchQuery") && value != null && !value.isEmpty()) {
          try {
            if (key.equals("isEnabled")) {
              int isEnabledVal = Integer.parseInt(value);
              if (isEnabledVal == 0) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(key), false));
              } else if (isEnabledVal == 1) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(key), true));
              }
            } else {
              predicate = criteriaBuilder.and(predicate,
                  criteriaBuilder.like(
                      criteriaBuilder.lower(root.get(key)),
                      ("%" + value + "%").toLowerCase()));
            }
          } catch (IllegalArgumentException e) {
            throw new RuntimeException(key + " không tồn tại");
          }
        }
      }

      return predicate;
    };

    long total = userRepository.count(spec);
    List<User> users = userRepository.findAll(spec, pageRequest).getContent();

    users.forEach(user -> user.setPassword(null));

    Map<String, Object> response = new HashMap<>();
    response.put("users", users);
    response.put("total", total);

    return response;
  }

  public User getUserById(Integer userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    return user;
  }

  public User getUserByPhone(String username) {
    User user = userRepository.findByPhone(username)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    return user;
  }

  public User createUser(User user) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new RuntimeException("Email " + user.getEmail() + " đã tồn tại");
    }
    if (userRepository.findByPhone(user.getPhone()).isPresent()) {
      throw new RuntimeException("Số điện thoại " + user.getPhone() + " đã tồn tại");
    }

    Role role = roleRepository.findById(user.getRole().getId())
        .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + user.getRole().getId()));

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole(role);
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    user.setIsEnabled(true);

    User savedUser = userRepository.save(user);
    savedUser.setPassword(null);
    return savedUser;
  }

  public User upgradeUser(Integer userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    if (user.getRole().getName() == Role.RoleName.BROKER) {
      throw new RuntimeException("Tài khoản của bạn đã được nâng cấp");
    }

    Role brokerRole = roleRepository.findById(2)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò BROKER"));

    user.setRole(brokerRole);
    user.setUpdatedAt(LocalDateTime.now());

    User savedUser = userRepository.save(user);
    savedUser.setPassword(null);
    return savedUser;
  }

  public User updateStatusUser(Integer userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    user.setIsEnabled(!user.getIsEnabled());
    user.setUpdatedAt(LocalDateTime.now());

    User savedUser = userRepository.save(user);
    savedUser.setPassword(null);
    return savedUser;
  }

  public User updateUser(Integer userId, User updatedUser) {
    return userRepository.findById(userId).map(existingUser -> {
      existingUser.setFullName(updatedUser.getFullName());
      existingUser.setEmail(updatedUser.getEmail());
      existingUser.setPhone(updatedUser.getPhone());
      existingUser.setUpdatedAt(LocalDateTime.now());

      if (updatedUser.getRole() != null && updatedUser.getRole().getId() != null) {
        Role role = roleRepository.findById(updatedUser.getRole().getId())
            .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại"));
        existingUser.setRole(role);
      }

      User savedUser = userRepository.save(existingUser);
      savedUser.setPassword(null);
      return savedUser;
    }).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
  }

  public void deleteUser(Integer userId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("Người dùng không tồn tại");
    }
    userRepository.deleteById(userId);
  }
}
