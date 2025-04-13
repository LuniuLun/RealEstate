package apidemo.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.services.LandForecastService;

@RestController
@RequestMapping("/api/v1/forecast")
@RequiredArgsConstructor
@Slf4j
public class ForecastController {

  private final LandForecastService forecastService;

  @PostMapping("/land")
  public ResponseEntity<?> generateForecast(@RequestBody ForecastRequest request) {
    log.info("Received forecast request for district: {}, period: {} days",
        request.getDistrict(), request.getPeriodDays());

    if (request.getDistrict() == null || request.getDistrict().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Vui lòng chọn quận/huyện");
    }

    if (request.getPeriodDays() <= 0) {
      return ResponseEntity.badRequest().body("Số ngày không đúng");
    }

    try {
      if (!forecastService.isDistrictAvailable(request.getDistrict())) {
        return ResponseEntity.badRequest()
            .body(request.getDistrict() + " không tìm thấy trong dữ liệu");
      }

      ForecastResponse response = forecastService.generateForecast(
          request.getDistrict(),
          request.getPeriodDays());

      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      log.warn("Invalid forecast request: {}", e.getMessage());
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      log.error("Error generating forecast for district: {}", request.getDistrict(), e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error generating forecast. Please try again later.");
    }
  }
}