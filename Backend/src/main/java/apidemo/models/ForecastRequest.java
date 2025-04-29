package apidemo.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastRequest {
  private String district;
  @Builder.Default
  private Integer periodDays = 90;
  private Double width;
  private Double length;
  private Integer floors;
  private Integer rooms;
  private Integer toilets;
  private List<Integer> landCharacteristics;
  private Integer categoryId;
  private Integer landTypeId;
  private Integer directionId;
  private Integer furnishingId;
}