package com.gakudo.gateway.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class UserHeaderInjectionFilter extends OncePerRequestFilter {
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_ROLES_HEADER = "X-User-Roles";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = null;
        String roles = null;
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof Jwt jwt) {
            userId = jwt.getSubject();
            roles = extractRoles(jwt);
        }

        filterChain.doFilter(new UserHeaderRequestWrapper(request, userId, roles), response);
    }

    private String extractRoles(Jwt jwt) {
        Object rolesClaim = jwt.getClaims().get("roles");
        if (rolesClaim instanceof Collection<?> roles) {
            return String.join(",", roles.stream().map(Object::toString).toList());
        }

        Object roleClaim = jwt.getClaims().get("role");
        return roleClaim == null ? "" : roleClaim.toString();
    }

    private static class UserHeaderRequestWrapper extends HttpServletRequestWrapper {
        private final String userId;
        private final String roles;

        UserHeaderRequestWrapper(HttpServletRequest request, String userId, String roles) {
            super(request);
            this.userId = userId;
            this.roles = roles;
        }

        @Override
        public String getHeader(String name) {
            if (isUserHeader(name)) {
                return USER_ID_HEADER.equalsIgnoreCase(name) ? userId : roles;
            }
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            String header = getHeader(name);
            if (isUserHeader(name)) {
                return header == null ? Collections.emptyEnumeration() : Collections.enumeration(List.of(header));
            }
            return super.getHeaders(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            Set<String> headerNames = new LinkedHashSet<>();
            Enumeration<String> originalNames = super.getHeaderNames();
            while (originalNames.hasMoreElements()) {
                String name = originalNames.nextElement();
                if (!isUserHeader(name)) {
                    headerNames.add(name);
                }
            }
            if (userId != null) {
                headerNames.add(USER_ID_HEADER);
            }
            if (roles != null) {
                headerNames.add(USER_ROLES_HEADER);
            }
            return Collections.enumeration(new ArrayList<>(headerNames));
        }

        private boolean isUserHeader(String name) {
            String normalized = name.toLowerCase(Locale.ROOT);
            return USER_ID_HEADER.toLowerCase(Locale.ROOT).equals(normalized)
                    || USER_ROLES_HEADER.toLowerCase(Locale.ROOT).equals(normalized);
        }
    }
}
