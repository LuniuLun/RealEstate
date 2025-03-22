package apidemo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apidemo.models.LoginRequest;
import apidemo.models.LogoutRequest;
import apidemo.models.Token;
import apidemo.models.User;
import apidemo.services.JwtService;
import apidemo.services.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final UserService userService;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;

  public AuthController(UserService userService, JwtService jwtService, PasswordEncoder passwordEncoder) {
    this.userService = userService;
    this.jwtService = jwtService;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
      User user = userService.getUserByPhone(loginRequest.getPhone());
      if (user == null) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Số điện thoại không tồn tại");
        return ResponseEntity.badRequest().body(errorResponse);
      }
      if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Mật khẩu hoặc số điện thoại không đúng");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      Token token = jwtService.generateToken(user);
      return ResponseEntity.ok(token);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@RequestBody LogoutRequest logoutRequest) {
    try {
      jwtService.invalidateToken(logoutRequest.getToken());

      Map<String, String> response = new HashMap<>();
      response.put("message", "Logout successful");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @PostMapping("/register")
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

  @PostMapping("/login/token")
  public ResponseEntity<?> loginWithToken(@RequestBody Map<String, String> tokenRequest) {
    try {
      String token = tokenRequest.get("token");

      if (token == null || token.isEmpty()) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Token is required");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      boolean isExpired = jwtService.isTokenInDatabase(token);

      if (isExpired) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Token has expired, please login again");
        errorResponse.put("code", "TOKEN_EXPIRED");
        return ResponseEntity.status(401).body(errorResponse);
      }

      User user = jwtService.getUserFromToken(token);

      if (user == null) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Invalid token");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      Token newToken = jwtService.generateToken(user);
      Map<String, Object> response = new HashMap<>();
      response.put("token", newToken);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }
}