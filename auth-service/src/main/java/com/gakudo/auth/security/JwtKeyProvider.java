package com.gakudo.auth.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.converter.RsaKeyConverters;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

@Component
public class JwtKeyProvider {
    @Value("${gakudo.jwt.private-key:}")
    private String privateKeyPem;

    @Value("${gakudo.jwt.public-key:}")
    private String publicKeyPem;

    @Value("${gakudo.jwt.key-id:gakudo-auth-key}")
    private String keyId;

    private RSAKey rsaKey;

    @PostConstruct
    void initialize() {
        if (StringUtils.hasText(privateKeyPem) && StringUtils.hasText(publicKeyPem)) {
            RSAPrivateKey privateKey = readPrivateKey(privateKeyPem);
            RSAPublicKey publicKey = readPublicKey(publicKeyPem);
            this.rsaKey = new RSAKey.Builder(publicKey)
                    .privateKey(privateKey)
                    .keyID(keyId)
                    .build();
            return;
        }

        KeyPair keyPair = generateDevelopmentKeyPair();
        this.rsaKey = new RSAKey.Builder((RSAPublicKey) keyPair.getPublic())
                .privateKey((RSAPrivateKey) keyPair.getPrivate())
                .keyID(keyId + "-" + UUID.randomUUID())
                .build();
    }

    public JWKSource<SecurityContext> jwkSource() {
        return new ImmutableJWKSet<>(new JWKSet(rsaKey));
    }

    public JWKSet publicJwkSet() {
        return new JWKSet(rsaKey.toPublicJWK());
    }

    private RSAPrivateKey readPrivateKey(String pem) {
        return RsaKeyConverters.pkcs8().convert(new ByteArrayInputStream(normalizePem(pem).getBytes(StandardCharsets.UTF_8)));
    }

    private RSAPublicKey readPublicKey(String pem) {
        return RsaKeyConverters.x509().convert(new ByteArrayInputStream(normalizePem(pem).getBytes(StandardCharsets.UTF_8)));
    }

    private String normalizePem(String pem) {
        return pem.replace("\\n", "\n").trim();
    }

    private KeyPair generateDevelopmentKeyPair() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            return generator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException("Cannot initialize JWT RSA key pair", e);
        }
    }
}
