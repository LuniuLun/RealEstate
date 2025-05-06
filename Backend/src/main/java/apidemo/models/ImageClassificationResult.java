package apidemo.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ImageClassificationResult {
  private final float safeScore;
  private final float unsafeScore;
  private final boolean isSafe;
}
