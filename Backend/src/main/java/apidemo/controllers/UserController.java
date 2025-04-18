package apidemo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import apidemo.models.User;
import apidemo.models.Role.RoleName;
import apidemo.services.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<?> getAllUsers(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      // Ensure filters is not null before removing keys
      if (filters != null) {
        filters.remove("page");
        filters.remove("limit");
        filters.remove("sortBy");
        filters.remove("typeOfSort");
      }
      User currentUser = getCurrentUser();
      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền lấy thông tin người dùng");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      Map<String, Object> users = userService.getAllUsers(limit, page, sortBy, typeOfSort, filters);
      return ResponseEntity.ok(users);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getUserById(@PathVariable Integer id) {
    try {
      User currentUser = getCurrentUser();
      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền lấy thông tin người dùng");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      User user = userService.getUserById(id);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUserProfile() {
    try {
      User currentUser = getCurrentUser();
      return ResponseEntity.ok(currentUser);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
  }

  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody User user) {
    try {
      User currentUser = getCurrentUser();
      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền tạo người dụng");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      User createdUser = userService.createUser(user);
      return ResponseEntity.ok(createdUser);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
    try {
      User currentUser = getCurrentUser();

      if (!currentUser.getId().equals(id) && currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền thay đổi người dùng này");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      User updated = userService.updateUser(id, updatedUser);
      return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @PutMapping("/upgrade/{id}")
  public ResponseEntity<?> upgradeUser(@PathVariable Integer id) {
    try {
      User currentUser = getCurrentUser();

      if (!currentUser.getId().equals(id) && currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền thay đổi người dùng này");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      User upgradedUser = userService.upgradeUser(id);
      return ResponseEntity.ok(upgradedUser);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @PutMapping("/status/{id}")
  public ResponseEntity<?> updateStatusUser(@PathVariable Integer id) {
    try {
      User currentUser = getCurrentUser();

      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền khoá người dùng này");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      User updatedStatusUser = userService.updateStatusUser(id);
      return ResponseEntity.ok(updatedStatusUser);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
    try {
      User currentUser = getCurrentUser();

      if (currentUser.getRole().getName() != RoleName.ADMIN) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Bạn không có quyền xoá người dùng này");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
      }

      userService.deleteUser(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  // @PutMapping("/{id}/change-password")
  // public ResponseEntity<?> changePassword(
  // @PathVariable Integer id,
  // @RequestBody Map<String, String> passwordRequest) {
  // try {
  // User currentUser = getCurrentUser();

  // // Only allow users to change their own password
  // if (!currentUser.getId().equals(id)) {
  // Map<String, String> errorResponse = new HashMap<>();
  // errorResponse.put("message", "You are not authorized to change this user's
  // password");
  // return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  // }

  // String oldPassword = passwordRequest.get("oldPassword");
  // String newPassword = passwordRequest.get("newPassword");

  // if (oldPassword == null || newPassword == null) {
  // Map<String, String> errorResponse = new HashMap<>();
  // errorResponse.put("message", "Old password and new password are required");
  // return ResponseEntity.badRequest().body(errorResponse);
  // }

  // User updated = userService.changePassword(id, oldPassword, newPassword);
  // return ResponseEntity.ok(updated);
  // } catch (RuntimeException e) {
  // Map<String, String> errorResponse = new HashMap<>();
  // errorResponse.put("message", e.getMessage());
  // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  // }
  // }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.badRequest().body(errorResponse);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  // Helper method to get current authenticated user
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new RuntimeException("Not authenticated");
    }
    return (User) authentication.getPrincipal();
  }
}