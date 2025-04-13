package apidemo.models;

import lombok.Data;

@Data
public class ForecastRequest {
  private String district;
  private Integer periodDays = 90;
}
