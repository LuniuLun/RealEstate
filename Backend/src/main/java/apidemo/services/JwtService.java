package apidemo.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import apidemo.models.Token;
import apidemo.models.User;
import apidemo.repositories.TokenRepository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private Long jwtExpiration;

  private final TokenRepository tokenRepository;
  private final UserService userService;

  public JwtService(TokenRepository tokenRepository, @Lazy UserService userService) {
    this.tokenRepository = tokenRepository;
    this.userService = userService;
  }

  // Generate token for user
  public Token generateToken(User user) {
    Algorithm algorithm = Algorithm.HMAC256(secretKey);
    Date expiryDate = new Date(System.currentTimeMillis() + jwtExpiration * 1000);

    String jwtToken = JWT.create()
        .withSubject(user.getPhone())
        .withClaim("userId", user.getId())
        .withClaim("role", user.getRole().getName().toString())
        .withIssuedAt(new Date())
        .withExpiresAt(expiryDate)
        .sign(algorithm);

    // Save token to database
    Token token = new Token();
    token.setUser(user);
    token.setToken(jwtToken);
    token.setCreatedAt(LocalDateTime.now());
    token.setExpiresAt(LocalDateTime.ofInstant(expiryDate.toInstant(), ZoneId.systemDefault()));

    tokenRepository.save(token);

    return token;
  }

  // Validate token
  public boolean validateToken(String token, User user) {
    try {
      DecodedJWT decodedJWT = verifyToken(token);
      String phone = decodedJWT.getSubject();
      Date expirationDate = decodedJWT.getExpiresAt();

      return (phone.equals(user.getPhone()) &&
          expirationDate.after(new Date()) &&
          isTokenInDatabase(token));
    } catch (JWTVerificationException exception) {
      return false;
    }
  }

  // Verify token and return decoded JWT
  public DecodedJWT verifyToken(String token) {
    Algorithm algorithm = Algorithm.HMAC256(secretKey);
    JWTVerifier verifier = JWT.require(algorithm).build();
    return verifier.verify(token);
  }

  // Check if token exists in database and is not expired
  public boolean isTokenInDatabase(String token) {
    Optional<Token> storedToken = tokenRepository.findByToken(token);
    return storedToken.isPresent() &&
        storedToken.get().getExpiresAt().isAfter(LocalDateTime.now());
  }

  // Retrieve user from token
  public User getUserFromToken(String token) {
    try {
      DecodedJWT decodedJWT = verifyToken(token);
      Integer userId = decodedJWT.getClaim("userId").asInt();
      return userService.getUserById(userId);
    } catch (JWTVerificationException exception) {
      throw new RuntimeException("Invalid JWT token");
    }
  }

  // Extract phone from token
  public String extractUsername(String token) {
    try {
      DecodedJWT decodedJWT = verifyToken(token);
      return decodedJWT.getSubject();
    } catch (JWTVerificationException exception) {
      throw new RuntimeException("Invalid JWT token");
    }
  }

  // Invalidate token
  public void invalidateToken(String token) {
    Optional<Token> storedToken = tokenRepository.findByToken(token);
    if (storedToken.isPresent()) {
      Token tokenEntity = storedToken.get();
      tokenEntity.setExpiresAt(LocalDateTime.now());
      tokenRepository.save(tokenEntity);
    }
  }

  @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
  public void cleanupExpiredTokens() {
    LocalDateTime now = LocalDateTime.now();
    List<Token> expiredTokens = tokenRepository.findByExpiresAtBefore(now);
    tokenRepository.deleteAll(expiredTokens);
  }
}