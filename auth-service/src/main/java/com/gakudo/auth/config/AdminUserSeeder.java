package com.gakudo.auth.config;

import com.gakudo.auth.model.User;
import com.gakudo.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminUserSeeder {

    @Bean
    CommandLineRunner seedAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${gakudo.admin.email:}") String adminEmail,
            @Value("${gakudo.admin.password:}") String adminPassword
    ) {
        return args -> {
            if (isBlank(adminEmail) || isBlank(adminPassword)) {
                return;
            }

            String normalizedEmail = adminEmail.trim().toLowerCase();
            User user = userRepository.findByEmail(normalizedEmail).orElseGet(User::new);

            user.setEmail(normalizedEmail);
            user.setRole("ADMIN");
            user.setPasswordHash(passwordEncoder.encode(adminPassword));

            userRepository.save(user);
        };
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
