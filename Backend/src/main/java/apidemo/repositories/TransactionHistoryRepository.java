package apidemo.repositories;

import apidemo.models.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Integer>,
    JpaSpecificationExecutor<TransactionHistory> {
  List<TransactionHistory> findByUser_id(Integer userId);

  List<TransactionHistory> findByTransactionType(TransactionHistory.TransactionType type);
}