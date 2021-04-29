package com.oceangromits.firmware.security;

import com.oceangromits.firmware.exceptions.GromitsException;
import com.oceangromits.firmware.model.Role;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    // TODO: Securely store our secret key
    @Value("${secret_key:defaultdevelopmentkeydonotuseifatallpossible}")
    private String secretKey;

    private Key key;

    private final long validLength = 365L * 24 * 60 * 60 * 1000; // 1 year in milliseconds


    @PostConstruct
    protected void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(String clientId, List<Role> roles) {
        Claims claims = Jwts.claims().setSubject(clientId);
        claims.put("auth", roles.stream().map(
                Role::getAuthority)
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

    // !! Use this !!
    public Authentication getAuthentication(String token) {
        String username = getClientId(token);
        String[] roleNames = getRoleNames(token);
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(roleNames);

        return new UsernamePasswordAuthenticationToken(username, "", authorities);
    }

    public String getClientId(String token) {
        return extractClaims(token)
                .getSubject();
    }

    public String[] getRoleNames(String token) {
        String[] authNames = new String[0];

        try {
            @SuppressWarnings("unchecked")
            Collection<String> collection = (Collection<String>) extractClaims(token).get("auth");
            return collection.toArray(authNames);
        } catch (Exception e) {
            return authNames;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
