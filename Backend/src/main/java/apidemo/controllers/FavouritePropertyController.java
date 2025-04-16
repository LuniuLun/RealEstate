package apidemo.controllers;

import apidemo.models.FavouriteProperty;
import apidemo.services.FavouritePropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/favouriteProperties")
public class FavouritePropertyController {

  private final FavouritePropertyService favouritePropertyService;

  public FavouritePropertyController(FavouritePropertyService favouritePropertyService) {
    this.favouritePropertyService = favouritePropertyService;
  }

  @GetMapping("/{userId}")
  public ResponseEntity<?> getUserFavourites(
      @PathVariable Integer userId,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort) {
    try {
      Map<String, Object> response = favouritePropertyService.getFavouritePropertiesByUserId(
          userId, limit, page, sortBy, typeOfSort);
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping("/{userId}/property/{propertyId}")
  public ResponseEntity<?> toggleFavourite(@PathVariable Integer userId, @PathVariable Integer propertyId) {
    try {
      FavouriteProperty favourite = favouritePropertyService.toggleFavouriteProperty(userId, propertyId);
      return ResponseEntity.ok(favourite);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.badRequest().body(errorResponse);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}