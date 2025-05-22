package apidemo.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.models.Role.RoleName;
import apidemo.models.User;
import apidemo.services.PropertyForecastService;

@RestController
@RequestMapping("/api/v1/forecast")
@RequiredArgsConstructor
@Slf4j
public class ForecastController {

  private final PropertyForecastService forecastService;

  @PostMapping("")
  public ResponseEntity<?> generateForecast(@RequestBody ForecastRequest request) {
    log.info("Received forecast request for period: {}", request.getPeriodDays());

    try {
      if (request.getPeriodDays() > 1) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getName() != RoleName.BROKER &&
            currentUser.getRole().getName() != RoleName.ADMIN) {
          return ResponseEntity.status(HttpStatus.FORBIDDEN)
              .body(Map.of("message", "Nâng cấp tài khoản trước để dùng chức năng này"));
        }
      }

      ForecastResponse response = forecastService.generateForecast(request);
      return ResponseEntity.ok(response);

    } catch (IllegalArgumentException e) {
      log.warn("Invalid forecast request: {}", e.getMessage());
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
      log.error("Unexpected error: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("message", "Lỗi hệ thống. Vui lòng thử lại sau."));
    }
  }

  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new RuntimeException("Not authenticated");
    }
    return (User) authentication.getPrincipal();
  }
}