package com.ecovision.backend.service;

import com.ecovision.backend.model.Role;
import com.ecovision.backend.model.User;
import com.ecovision.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public long getUserCount() {
        return userRepository.getUserCount();
    }

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user (email/password flow)
    public User registerUser(String name, String email, String password, Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required for normal signup");
        }
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setRole(role == null ? Role.USER : role);
        newUser.setPassword(passwordEncoder.encode(password));

        return userRepository.save(newUser);

    }

    public User registerGoogleUser(String name, String email) {
        // If user exists, return it (safe)
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setRole(Role.USER);

        // Generate a random password and encode it so DB NOT NULL constraint is met.
        // This is not a real password the user knows; they must use Google SSO.
        String randomPassword = UUID.randomUUID().toString();
        newUser.setPassword(passwordEncoder.encode(randomPassword));

        try {
            return userRepository.save(newUser);
        } catch (DataIntegrityViolationException ex) {
            // Re-throw with helpful message so controller can log/handle it.
            throw new RuntimeException("Failed to create google user: " + ex.getMessage(), ex);
        }
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Check password - null-safe
    // Returns false if encodedPassword is null (i.e. passwordless/Google accounts)
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        if (encodedPassword == null || rawPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Load user for authentication (required by Spring Security)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // Map Role enum to Spring authorities (ROLE_USER, ROLE_ADMIN, etc.)
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // may be null for Google accounts
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
