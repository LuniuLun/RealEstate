package apidemo.jwt;

import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import apidemo.models.User;
import apidemo.services.JwtService;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      final String jwt = authHeader.substring(7);

      // Check if token exists in database
      if (jwtService.isTokenInDatabase(jwt)) {
        // Get user from token
        User user = jwtService.getUserFromToken(jwt);

        // Validate token
        if (jwtService.validateToken(jwt, user)) {
          UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
              user,
              null,
              Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())));

          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      }
    } catch (JWTVerificationException e) {
      // Log the exception
      logger.error("JWT token validation failed: {}" + e.getMessage());
    } catch (Exception e) {
      // Log the exception
      logger.error("Error processing JWT token: {}" + e.getMessage());
    }

    filterChain.doFilter(request, response);
  }
}