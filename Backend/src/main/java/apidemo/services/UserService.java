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

    long total = userRepository.count(spec);
    List<User> users = userRepository.findAll(spec, pageRequest).getContent();

    users.forEach(user -> user.setPassword(null));

    users.forEach(user -> user.setPassword(null));

    Map<String, Object> response = new HashMap<>();
    response.put("users", users);
    response.put("total", total);

    return response;
  }

  public User getUserById(Integer userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    user.setPassword(null);
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
