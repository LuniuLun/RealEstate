package apidemo.services;

import apidemo.models.FavouriteProperty;
import apidemo.models.Property;
import apidemo.models.User;
import apidemo.repositories.FavouritePropertyRepository;
import apidemo.repositories.PropertyRepository;
import apidemo.repositories.UserRepository;
import apidemo.utils.Filter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FavouritePropertyService {

  private final FavouritePropertyRepository favouritePropertyRepository;
  private final UserRepository userRepository;
  private final PropertyRepository propertyRepository;
  private final Filter filter = new Filter();

  public FavouritePropertyService(FavouritePropertyRepository favouritePropertyRepository,
      UserRepository userRepository,
      PropertyRepository propertyRepository) {
    this.favouritePropertyRepository = favouritePropertyRepository;
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
  }

  public Map<String, Object> getFavouritePropertiesByUserId(Integer userId, Integer limit, Integer page,
      String sortBy, String typeOfSort) {
    if (page != null && page < 1) {
      throw new IllegalArgumentException("Page index must be greater than zero");
    }

    // Verify user exists
    userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Create page request
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    // Create specification for filtering by userId
    Specification<FavouriteProperty> spec = (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      predicates.add(cb.equal(root.get("user").get("id"), userId));
      return cb.and(predicates.toArray(new Predicate[0]));
    };

    // Get paginated results using specification
    Page<FavouriteProperty> favouritesPage = favouritePropertyRepository.findAll(spec, pageRequest);

    // Create response
    Map<String, Object> response = new HashMap<>();
    response.put("favouriteProperties", favouritesPage.getContent());
    response.put("total", favouritesPage.getTotalElements());

    return response;
  }

  public List<FavouriteProperty> getAllFavouritePropertiesByUserId(Integer userId) {
    userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    return favouritePropertyRepository.findByUserId(userId);
  }

  public List<Integer> getFavouritePropertyIdsByUserId(Integer userId) {
    userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    List<FavouriteProperty> favouriteProperties = favouritePropertyRepository.findByUserId(userId);

    return favouriteProperties.stream()
        .map(fp -> fp.getProperty().getId())
        .toList();
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
      return existingFavourite.get();
    } else {
      FavouriteProperty newFavourite = new FavouriteProperty();
      newFavourite.setUser(user);
      newFavourite.setProperty(property);
      return favouritePropertyRepository.save(newFavourite);
    }
  }
}