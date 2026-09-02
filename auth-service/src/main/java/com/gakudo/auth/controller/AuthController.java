package com.gakudo.auth.controller;
import com.gakudo.auth.dto.request.LoginRequest;
import com.gakudo.auth.dto.request.RegisterRequest;
import com.gakudo.auth.dto.response.ApiResponse;
import com.gakudo.auth.dto.response.AuthResponse;
import com.gakudo.auth.model.RefreshToken;
import com.gakudo.auth.model.User;
import com.gakudo.auth.security.SecurityUtil;
import com.gakudo.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${gakudo.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;
    private final AuthService authService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    
    public AuthController(AuthService authService, AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil) {
        this.authService = authService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            AuthResponse response = new AuthResponse(user.getId(), user.getEmail(), user.getRole(), null);
            return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công!", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginDto) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User currentUser = authService.getUserByEmail(loginDto.getEmail());
            String accessToken = securityUtil.createAccessToken(currentUser);
            RefreshToken newRefreshToken = authService.createRefreshToken(currentUser, refreshTokenExpiration);
            
            ResponseCookie resCookie = ResponseCookie.from("refresh_token", newRefreshToken.getToken())
                    .httpOnly(true).path("/").maxAge(refreshTokenExpiration).secure(false).build();
            
            AuthResponse response = new AuthResponse(currentUser.getId(), currentUser.getEmail(), currentUser.getRole(), accessToken);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookie.toString())
                    .body(ApiResponse.success("Đăng nhập thành công!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sai tài khoản hoặc mật khẩu"));
        }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) {
        if (refreshToken.isEmpty()) return ResponseEntity.badRequest().body(ApiResponse.error("Chưa có refresh token ở cookie"));
        try {
            RefreshToken rt = authService.verifyRefreshToken(refreshToken);
            User currentUser = rt.getUser();
            String accessToken = securityUtil.createAccessToken(currentUser);
            RefreshToken newRefreshToken = authService.createRefreshToken(currentUser, refreshTokenExpiration);
            
            ResponseCookie resCookie = ResponseCookie.from("refresh_token", newRefreshToken.getToken())
                    .httpOnly(true).path("/").maxAge(refreshTokenExpiration).secure(false).build();
                    
            AuthResponse response = new AuthResponse(currentUser.getId(), currentUser.getEmail(), currentUser.getRole(), accessToken);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookie.toString())
                    .body(ApiResponse.success("Làm mới token thành công!", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@CookieValue(name = "refresh_token", defaultValue = "") String refreshToken) {
        if (!refreshToken.isEmpty()) {
            try {
                RefreshToken rt = authService.verifyRefreshToken(refreshToken);
                authService.deleteRefreshTokenByUser(rt.getUser());
            } catch (Exception ignored) {}
        }
        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "").httpOnly(true).path("/").maxAge(0).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(ApiResponse.success("Đăng xuất thành công!", null));
    }
}
