package apidemo.services;

import apidemo.models.FavouriteProperty;
import apidemo.models.Property;
import apidemo.models.User;
import apidemo.repositories.FavouritePropertyRepository;
import apidemo.repositories.PropertyRepository;
import apidemo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class FavouritePropertyService {

  private final FavouritePropertyRepository favouritePropertyRepository;
  private final UserRepository userRepository;
  private final PropertyRepository propertyRepository;

  public FavouritePropertyService(FavouritePropertyRepository favouritePropertyRepository,
      UserRepository userRepository,
      PropertyRepository propertyRepository) {
    this.favouritePropertyRepository = favouritePropertyRepository;
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
  }

  public List<FavouriteProperty> getFavouritePropertiesByUserId(Integer userId) {
    userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    return favouritePropertyRepository.findByUserId(userId);
  }

  public FavouriteProperty toggleFavouriteProperty(Integer userId, Integer propertyId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    Property property = propertyRepository.findById(propertyId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

    Optional<FavouriteProperty> existingFavourite = favouritePropertyRepository.findByUserIdAndPropertyId(userId,
        propertyId);

    if (existingFavourite.isPresent()) {
      favouritePropertyRepository.delete(existingFavourite.get());
      return null;
    } else {
      FavouriteProperty newFavourite = new FavouriteProperty();
      newFavourite.setUser(user);
      newFavourite.setProperty(property);
      return favouritePropertyRepository.save(newFavourite);
    }
  }
}
