package apidemo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import apidemo.models.PaymentRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@Service
public class VNPayService {

  @Value("${vnpay.tmnCode}")
  private String vnpTmnCode;

  @Value("${vnpay.secretKey}")
  private String vnpSecretKey;

  @Value("${vnpay.version}")
  private String vnpVersion;

  @Value("${vnpay.command}")
  private String vnpCommand;

  @Value("${vnpay.currCode}")
  private String vnpCurrCode;

  @Value("${vnpay.paymentUrl}")
  private String vnpPaymentUrl;

  @Value("${vnpay.timeZone}")
  private String timeZone;

  public String generatePaymentUrl(PaymentRequest request, String ipAddress) {
    try {
      // Multiply amount by 100 as per VNPay requirements
      long vnpAmount = request.getAmount() * 100;

      // Get current time in Vietnam timezone (GMT+7)
      Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
      SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
      String createDate = formatter.format(calendar.getTime());

      // Create a unique transaction reference
      String txnRef = String.valueOf(System.currentTimeMillis());

      // Create parameter map
      Map<String, String> vnpParams = new HashMap<>();
      vnpParams.put("vnp_Version", vnpVersion);
      vnpParams.put("vnp_Command", vnpCommand);
      vnpParams.put("vnp_TmnCode", vnpTmnCode);
      vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
      vnpParams.put("vnp_CreateDate", createDate);
      vnpParams.put("vnp_CurrCode", vnpCurrCode);
      vnpParams.put("vnp_IpAddr", ipAddress);
      vnpParams.put("vnp_Locale", "vn");
      vnpParams.put("vnp_OrderInfo", request.getOrderInfo());
      vnpParams.put("vnp_OrderType", "other");
      vnpParams.put("vnp_ReturnUrl", request.getVnpReturnUrl());
      vnpParams.put("vnp_TxnRef", txnRef);

      // Optional: Add expiry date (15 minutes from now)
      calendar.add(Calendar.MINUTE, 15);
      String expireDate = formatter.format(calendar.getTime());
      vnpParams.put("vnp_ExpireDate", expireDate);

      // Build data to hash and querystring, following the exact VNPay implementation
      List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
      Collections.sort(fieldNames);
      StringBuilder hashData = new StringBuilder();
      StringBuilder query = new StringBuilder();
      Iterator<String> itr = fieldNames.iterator();

      while (itr.hasNext()) {
        String fieldName = itr.next();
        String fieldValue = vnpParams.get(fieldName);
        if ((fieldValue != null) && (fieldValue.length() > 0)) {
          // Build hash data
          hashData.append(fieldName);
          hashData.append('=');
          hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

          // Build query
          query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
          query.append('=');
          query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

          if (itr.hasNext()) {
            query.append('&');
            hashData.append('&');
          }
        }
      }

      String queryUrl = query.toString();
      String vnpSecureHash = hmacSHA512(vnpSecretKey, hashData.toString());
      queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
      String paymentUrl = vnpPaymentUrl + "?" + queryUrl;

      return paymentUrl;
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Error generating VNPay payment URL", e);
    }
  }

  /**
   * Generate HMAC-SHA512 signature exactly as in VNPay's implementation
   */
  private String hmacSHA512(String key, String data) {
    try {
      Mac hmac = Mac.getInstance("HmacSHA512");
      SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA512");
      hmac.init(secretKeySpec);
      byte[] hmacBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

      // Convert bytes to hex
      StringBuilder result = new StringBuilder();
      for (byte b : hmacBytes) {
        result.append(String.format("%02x", b));
      }
      return result.toString();
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to generate HMAC-SHA512", e);
    }
  }
}