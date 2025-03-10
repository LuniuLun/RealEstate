package apidemo.controllers;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apidemo.models.Token;
import apidemo.models.User;
import apidemo.services.TokenService;
import apidemo.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;
  private final TokenService tokenService;

  public UserController(UserService userService, TokenService tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  @GetMapping
  public ResponseEntity<?> getAllUsers(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      filters.remove("page");
      filters.remove("limit");
      filters.remove("sortBy");
      filters.remove("typeOfSort");
      List<User> users = userService.getAllUsers(limit, page, sortBy, typeOfSort, filters);
      return ResponseEntity.ok(users);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getUserById(@PathVariable Integer id) {
    try {
      User user = userService.getUserById(id);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody User user) {
    try {
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
      User updated = userService.updateUser(id, updatedUser);
      return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
    try {
      userService.deleteUser(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) {
    Optional<Token> response = userService.login(username, password);
    if (response.isPresent()) {
      return ResponseEntity.ok(response.get());
    } else {
      return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
  }

  @PostMapping("/loginWithToken")
  public ResponseEntity<?> loginWithToken(@RequestParam String token) {
    try {
      Optional<User> user = tokenService.loginWithToken(token);
      if (user.isPresent()) {
        return ResponseEntity.ok(user.get());
      } else {
        return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
      }
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

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
    return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}