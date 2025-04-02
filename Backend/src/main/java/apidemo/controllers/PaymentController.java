package apidemo.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apidemo.models.PaymentRequest;
import apidemo.services.VNPayService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

  private final VNPayService vnPayService;

  public PaymentController(VNPayService vnPayService) {
    this.vnPayService = vnPayService;
  }

  @PostMapping("/create-vnpay-payment")
  public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request, HttpServletRequest servletRequest) {
    try {
      if (request == null || request.getAmount() <= 0 || request.getOrderInfo() == null
          || request.getVnpReturnUrl() == null) {
        return ResponseEntity.badRequest().body("Invalid payment request: Missing required fields.");
      }

      String ipAddress = servletRequest.getRemoteAddr();
      String paymentUrl = vnPayService.generatePaymentUrl(request, ipAddress);

      if (paymentUrl == null || paymentUrl.isEmpty()) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate payment URL.");
      }

      Map<String, String> response = new HashMap<>();
      response.put("paymentUrl", paymentUrl);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("An unexpected error occurred: " + e.getMessage());
    }
  }
}