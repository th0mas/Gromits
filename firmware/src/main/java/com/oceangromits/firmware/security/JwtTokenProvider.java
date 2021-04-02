package com.oceangromits.firmware.security;

import com.oceangromits.firmware.GromitsException;
import com.oceangromits.firmware.model.Role;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    // TODO: Securely store our secret key
    @Value("${security.jwt.token.secret_key:secret-key}")
    private String secretKey;
    private Key key;

    private final long validLength = 365L * 24 * 60 * 60 * 1000; // 1 year in milliseconds

    @Autowired

    private ClientDetails clientDetails;

    @PostConstruct
    protected void init() {
        key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // TODO: Persist this as it resets every time
    }

    public String createToken(String clientId, List<Role> roles) {
        Claims claims = Jwts.claims().setSubject(clientId);
        claims.put("auth", roles.stream().map(
                s -> new SimpleGrantedAuthority(s.getAuthority()))
                .collect(Collectors.toList()));

        Date now = new Date();
        Date validity = new Date(now.getTime() + validLength);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (Objects.nonNull(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Cut off "Bearer "
        }

        return null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            throw new GromitsException("Expired or Invalid JWT token", HttpStatus.BAD_REQUEST);
        }
    }

    // TODO: think we don't want to do this? i'd prefer
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = clientDetails.loadUserByUsername(getClientId(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getClientId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
