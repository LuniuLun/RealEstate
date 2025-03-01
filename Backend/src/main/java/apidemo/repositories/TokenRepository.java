package apidemo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import apidemo.models.Token;

public interface TokenRepository extends JpaRepository<Token, Integer> {
  Optional<Token> findByToken(String token);

  @Query("SELECT t FROM Token t WHERE t.user.id = :userId")
  Optional<Token> findByUserId(@Param("userId") Integer userId);

}
