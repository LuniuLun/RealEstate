package apidemo.controllers;

import apidemo.models.TransactionHistory;
import apidemo.services.TransactionHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionHistoryController {

  private final TransactionHistoryService transactionService;

  public TransactionHistoryController(TransactionHistoryService transactionService) {
    this.transactionService = transactionService;
  }

  @GetMapping
  public ResponseEntity<?> getAllTransactions(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      if (filters != null) {
        filters.remove("page");
        filters.remove("limit");
        filters.remove("sortBy");
        filters.remove("typeOfSort");
      }

      List<TransactionHistory> transactions = transactionService.getAllTransactions(
          limit, page, sortBy, typeOfSort, filters);
      return ResponseEntity.ok(transactions);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getTransactionById(@PathVariable Integer id) {
    try {
      TransactionHistory transaction = transactionService.getTransactionById(id);
      return ResponseEntity.ok(transaction);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<?> getTransactionsByUserId(@PathVariable Integer userId,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) String typeOfSort,
      @RequestParam(required = false) Map<String, String> filters) {
    try {
      if (filters != null) {
        filters.remove("page");
        filters.remove("limit");
        filters.remove("sortBy");
        filters.remove("typeOfSort");
      }

      List<TransactionHistory> transactions = transactionService.getTransactionsByUserId(userId, limit, page, sortBy,
          typeOfSort, filters);
      return ResponseEntity.ok(transactions);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> createTransaction(@RequestBody TransactionHistory transaction) {
    try {
      TransactionHistory savedTransaction = transactionService.createTransaction(transaction);
      return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateTransaction(
      @PathVariable Integer id,
      @RequestBody TransactionHistory transaction) {
    try {
      TransactionHistory updatedTransaction = transactionService.updateTransaction(id, transaction);
      return ResponseEntity.ok(updatedTransaction);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTransaction(@PathVariable Integer id) {
    try {
      transactionService.deleteTransaction(id);
      Map<String, String> response = new HashMap<>();
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}