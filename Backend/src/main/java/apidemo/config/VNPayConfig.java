package apidemo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
public class VNPayConfig {

  private String tmnCode;
  private String secretKey;
  private String version;
  private String command;
  private String currCode;
  private String paymentUrl;
  private String timeZone;

  // Constructors
  public VNPayConfig() {
  }

  // Getters and Setters
  public String getTmnCode() {
    return tmnCode;
  }

  public void setTmnCode(String tmnCode) {
    this.tmnCode = tmnCode;
  }

  public String getSecretKey() {
    return secretKey;
  }

  public void setSecretKey(String secretKey) {
    this.secretKey = secretKey;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getCommand() {
    return command;
  }

  public void setCommand(String command) {
    this.command = command;
  }

  public String getCurrCode() {
    return currCode;
  }

  public void setCurrCode(String currCode) {
    this.currCode = currCode;
  }

  public String getPaymentUrl() {
    return paymentUrl;
  }

  public void setPaymentUrl(String paymentUrl) {
    this.paymentUrl = paymentUrl;
  }

  public String getTimeZone() {
    return timeZone;
  }

  public void setTimeZone(String timeZone) {
    this.timeZone = timeZone;
  }
}