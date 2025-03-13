package apidemo.models;

public class PaymentRequest {
  private long amount;
  private String orderInfo;
  private String vnpReturnUrl;

  // Getters and setters
  public long getAmount() {
    return amount;
  }

  public void setAmount(long amount) {
    this.amount = amount;
  }

  public String getVnpReturnUrl() {
    return vnpReturnUrl;
  }

  public void setVnpReturnUrl(String vnpReturnUrl) {
    this.vnpReturnUrl = vnpReturnUrl;
  }

  public String getOrderInfo() {
    return orderInfo;
  }

  public void setOrderInfo(String orderInfo) {
    this.orderInfo = orderInfo;
  }
}