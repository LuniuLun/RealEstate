package apidemo.services;

import org.springframework.stereotype.Service;

import apidemo.models.Token;
import apidemo.models.User;
import apidemo.repositories.TokenRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService {

  private final TokenRepository tokenRepository;

  public TokenService(TokenRepository tokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  public Optional<Token> getValidTokenForUser(Integer userId) {
    Optional<Token> existingToken = tokenRepository.findByUserId(userId);
    if (existingToken.isPresent() && existingToken.get().getExpiresAt().isAfter(LocalDateTime.now())) {
      return existingToken;
    }
    existingToken.ifPresent(tokenRepository::delete);
    return Optional.empty();
  }

  public Token createTokenForUser(User user) {
    tokenRepository.findByUserId(user.getId()).ifPresent(tokenRepository::delete);

    Token newToken = new Token();
    newToken.setUser(user);
    newToken.setToken(UUID.randomUUID().toString());
    newToken.setExpiresAt(LocalDateTime.now().plusDays(7));
    newToken.setCreatedAt(LocalDateTime.now());
    return tokenRepository.save(newToken);
  }

  public void deleteToken(Token token) {
    tokenRepository.delete(token);
  }

  public Optional<User> loginWithToken(String token) {
    Optional<Token> existingToken = tokenRepository.findByToken(token);
    if (existingToken.isPresent() && existingToken.get().getExpiresAt().isAfter(LocalDateTime.now())) {
      return Optional.of(existingToken.get().getUser());
    }
    return Optional.empty();
  }
}
