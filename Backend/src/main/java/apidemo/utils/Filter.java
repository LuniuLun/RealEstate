package apidemo.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class Filter {
  /**
   * Creates a PageRequest object with specified pagination and sorting parameters
   */
  public Pageable createPageRequest(Integer limit, Integer page, String sortBy, String typeOfSort) {
    // Default values
    int pageSize = limit != null ? limit : 10;
    int pageNum = page != null ? page - 1 : 0;
    String sortField = sortBy != null && !sortBy.isEmpty() ? sortBy : "createdAt";
    Sort.Direction direction = "asc".equalsIgnoreCase(typeOfSort) ? Sort.Direction.ASC : Sort.Direction.DESC;

    return PageRequest.of(pageNum, pageSize, Sort.by(direction, sortField));
  }

}
