package com.gakudo.auth.dto.response;
import java.util.UUID;
public class AuthResponse {
    private UUID id;
    private String email;
    private String role;
    private String accessToken;
    public AuthResponse(UUID id, String email, String role, String accessToken) {
        this.id = id; this.email = email; this.role = role; this.accessToken = accessToken;
    }
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getAccessToken() { return accessToken; }
}
