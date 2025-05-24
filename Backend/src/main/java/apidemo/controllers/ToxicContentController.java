package apidemo.controllers;

import apidemo.models.ToxicityRequest;
import apidemo.models.ToxicityResponse;
import apidemo.services.ToxicContentDetectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/toxicity")
public class ToxicContentController {
  @Autowired
  private ToxicContentDetectionService toxicityService;

  @PostMapping("/toxic-content-detection")
  public ResponseEntity<ToxicityResponse> analyze(@RequestBody ToxicityRequest request) {
    try {
      ToxicityResponse resp = toxicityService.detectToxicity(request.getText());
      return ResponseEntity.ok(resp);
    } catch (IllegalArgumentException iae) {
      return ResponseEntity.badRequest().build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(500).build();
    }
  }
}
