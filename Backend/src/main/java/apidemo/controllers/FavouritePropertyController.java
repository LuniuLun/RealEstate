package apidemo.controllers;

import apidemo.models.FavouriteProperty;
import apidemo.services.FavouritePropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/favourites")
public class FavouritePropertyController {

  private final FavouritePropertyService favouritePropertyService;

  public FavouritePropertyController(FavouritePropertyService favouritePropertyService) {
    this.favouritePropertyService = favouritePropertyService;
  }

  @GetMapping("/{userId}")
  public ResponseEntity<?> getUserFavourites(@PathVariable Integer userId) {
    try {
      List<FavouriteProperty> favourites = favouritePropertyService.getFavouritePropertiesByUserId(userId);
      return ResponseEntity.ok(favourites);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping("/{userId}/{propertyId}")
  public ResponseEntity<?> toggleFavourite(@PathVariable Integer userId, @PathVariable Integer propertyId) {
    try {
      FavouriteProperty favourite = favouritePropertyService.toggleFavouriteProperty(userId, propertyId);
      if (favourite == null) {
        return ResponseEntity.ok().build();
      }
      return ResponseEntity.ok(favourite);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }
}
