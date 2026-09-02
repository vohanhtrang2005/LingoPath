package com.gakudo.auth.security;
import com.gakudo.auth.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class SecurityUtil {
    @Value("${gakudo.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtKeyProvider jwtKeyProvider) {
        this.jwtEncoder = new NimbusJwtEncoder(jwtKeyProvider.jwkSource());
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now();
        Instant validity = now.plus(accessTokenExpiration, ChronoUnit.SECONDS);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("roles", List.of(user.getRole()))
                .build();
        JwsHeader jwsHeader = JwsHeader.with(SignatureAlgorithm.RS256).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
