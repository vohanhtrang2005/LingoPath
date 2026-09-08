package com.gakudo.auth.controller;

import com.gakudo.auth.security.JwtKeyProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class JwksController {
    private final JwtKeyProvider jwtKeyProvider;

    public JwksController(JwtKeyProvider jwtKeyProvider) {
        this.jwtKeyProvider = jwtKeyProvider;
    }

    // Muc dich: Cong khai public keys de Gateway validate JWT RS256.
    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> jwks() {
        return jwtKeyProvider.publicJwkSet().toJSONObject();
    }
}
