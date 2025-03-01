package apidemo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apidemo.models.Token;
import apidemo.models.User;
import apidemo.services.TokenService;
import apidemo.services.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;
  private final TokenService tokenService;

  @Autowired
  public UserController(UserService userService, TokenService tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  @GetMapping
  public List<User> getAllUsers(@RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam Map<String, String> filters) {
    filters.remove("page");
    filters.remove("limit");
    filters.remove("sortBy");
    filters.remove("typeOfSort");
    return userService.getAllUsers(limit, page, sortBy, typeOfSort, filters);
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Integer id) {
    return userService.getUserById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> createUser(@RequestBody User user) {
    try {
      return ResponseEntity.ok(userService.createUser(user));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
    try {
      return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
    try {
      userService.deleteUser(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
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
  public ResponseEntity<Object> loginWithToken(@RequestParam String token) {
    Optional<User> user = tokenService.loginWithToken(token);
    if (user.isPresent()) {
      return ResponseEntity.ok(user.get());
    } else {
      return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
    }
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
    return ResponseEntity.status(500).body(Map.of("message", ex.getMessage()));
  }
}