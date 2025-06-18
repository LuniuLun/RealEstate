package apidemo.services;

import apidemo.models.TransactionHistory;
import apidemo.models.User;
import apidemo.repositories.TransactionHistoryRepository;
import apidemo.utils.Filter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TransactionHistoryService {

  private final TransactionHistoryRepository transactionHistoryRepository;
  private final UserService userService;
  private final Filter filter = new Filter();

  public TransactionHistoryService(TransactionHistoryRepository transactionHistoryRepository,
      UserService userService) {
    this.transactionHistoryRepository = transactionHistoryRepository;
    this.userService = userService;
  }

  public Map<String, Object> getAllTransactions(Integer limit, Integer page, String sortBy,
      String typeOfSort, Map<String, String> filters) {
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);
    Page<TransactionHistory> pageResult = transactionHistoryRepository.findAll(createSpecification(filters),
        pageRequest);

    Map<String, Object> response = new HashMap<>();
    response.put("transactions", pageResult.getContent());
    response.put("total", pageResult.getTotalElements());
    return response;
  }

  public Map<String, Object> getTransactionsByUserId(Integer userId, Integer limit, Integer page,
      String sortBy, String typeOfSort, Map<String, String> filters) {
    User user = userService.getUserById(userId);
    Pageable pageRequest = filter.createPageRequest(limit, page, sortBy, typeOfSort);

    Map<String, String> combinedFilters = new HashMap<>(filters);
    combinedFilters.remove("userId");

    Page<TransactionHistory> pageResult = transactionHistoryRepository.findAll(
        (root, query, cb) -> cb.and(
            cb.equal(root.get("user"), user),
            applyFilters(root, cb, combinedFilters)),
        pageRequest);

    Map<String, Object> response = new HashMap<>();
    response.put("transactions", pageResult.getContent());
    response.put("total", pageResult.getTotalElements());
    return response;
  }

  private Specification<TransactionHistory> createSpecification(Map<String, String> filters) {
    return (root, query, cb) -> applyFilters(root, cb, filters);
  }

  private Predicate applyFilters(Root<TransactionHistory> root, CriteriaBuilder cb,
      Map<String, String> filters) {
    Predicate predicate = cb.conjunction();

    for (Map.Entry<String, String> entry : filters.entrySet()) {
      String key = entry.getKey();
      String value = entry.getValue();

      if (value != null && !value.isEmpty()) {
        if (key.equals("userId")) {
          predicate = cb.and(predicate,
              cb.equal(root.join("user").get("id"), Integer.valueOf(value)));
        } else {
          predicate = cb.and(predicate,
              cb.like(root.get(key).as(String.class), "%" + value + "%"));
        }
      }
    }

    return predicate;
  }

  public TransactionHistory getTransactionById(Integer transactionId) {
    return transactionHistoryRepository.findById(transactionId)
        .orElseThrow(() -> new RuntimeException("Transaction does not exist"));
  }

  public TransactionHistory createTransaction(TransactionHistory transaction) {
    User user = userService.getUserById(transaction.getUser().getId());
    transaction.setUser(user);
    return transactionHistoryRepository.save(transaction);
  }

  public TransactionHistory updateTransaction(Integer transactionId, TransactionHistory transaction) {
    TransactionHistory existingTransaction = getTransactionById(transactionId);
    existingTransaction.setTransactionType(transaction.getTransactionType());
    existingTransaction.setAmount(transaction.getAmount());
    return transactionHistoryRepository.save(existingTransaction);
  }

  public void deleteTransaction(Integer transactionId) {
    transactionHistoryRepository.delete(getTransactionById(transactionId));
  }
}