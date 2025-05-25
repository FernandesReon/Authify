package com.reon.authify_backend.jwt;

import com.reon.authify_backend.model.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    @Value("${token.expiration-time}")
    private long tokenExpirationTime;

    @Value("${jwt.secret-key}")
    private String jwtSecret;

    /*
     * This class helps with everything related to JWT (JSON Web Token).
     * It does the following:
     *
     * 1. Reads the JWT token from the HTTP request header (Authorization: Bearer <token>)
     * 2. Creates a new token when a user logs in, using their email and roles
     * 3. Signs the token with a secret key to make sure it can't be tampered with
     * 4. Gets the user's email from the token later (used for authentication)
     * 5. Checks if the token is valid (not expired and correctly signed)
     *
     * In short: this class helps create, read, and verify JWT tokens securely.
     */


    public String getJwtFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer")){
            return bearerToken.substring(7);
        }

        if (request.getCookies() != null){
            for (Cookie cookie : request.getCookies()){
                if ("jwt".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String generateToken(User user){
        String email = user.getEmail();
        String roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));
        return Jwts.builder()
                .subject(email)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date((new Date().getTime() + tokenExpirationTime)))
                .signWith(key())
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtSecret));
    }

    public String getUsernameFromJwtToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build().parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            throw new RuntimeException(e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
