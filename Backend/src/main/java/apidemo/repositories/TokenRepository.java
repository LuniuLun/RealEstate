package apidemo.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import apidemo.models.Token;

public interface TokenRepository extends JpaRepository<Token, Integer> {
  Optional<Token> findByToken(String token);

  List<Token> findByUserIdAndExpiresAtAfter(Integer userId, LocalDateTime dateTime);

  List<Token> findByExpiresAtBefore(LocalDateTime dateTime);

  @Query("SELECT t FROM Token t WHERE t.user.id = :userId")
  Optional<Token> findByUserId(@Param("userId") Integer userId);

}
