package com.gakudo.auth.service;
import com.gakudo.auth.dto.request.RegisterRequest;
import com.gakudo.auth.model.RefreshToken;
import com.gakudo.auth.model.User;
import com.gakudo.auth.repository.RefreshTokenRepository;
import com.gakudo.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email này đã tồn tại trong hệ thống.");
        }
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(newUser);
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    @Transactional
    public RefreshToken createRefreshToken(User user, long expirationSeconds) {
        refreshTokenRepository.deleteByUser(user);
        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setUser(user);
        newRefreshToken.setToken(UUID.randomUUID().toString());
        newRefreshToken.setExpiryDate(Instant.now().plusSeconds(expirationSeconds));
        return refreshTokenRepository.save(newRefreshToken);
    }
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token không hợp lệ."));
        if (rt.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(rt);
            throw new IllegalArgumentException("Refresh Token đã hết hạn.");
        }
        return rt;
    }
    @Transactional
    public void deleteRefreshTokenByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
