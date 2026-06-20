package com.ecovision.backend.controller;

import com.ecovision.backend.model.User;
import com.ecovision.backend.service.JwtService;
import com.ecovision.backend.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        User created = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole());
        created.setPassword(null); // hide password in response
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        var userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !userService.checkPassword(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).build();
        }

        User user = userOpt.get();
        String documentId = user.getDocumentId();
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), documentId);
        return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getRole().name(), documentId));
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username == null || username.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
        String documentId = jwtService.extractClaim(token, claims -> claims.get("documentId", String.class));

        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("role", role);
        response.put("documentId", documentId);
        response.put("valid", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody TokenRequest request) {
        try {
            var jsonFactory = JacksonFactory.getDefaultInstance();
            var transport = GoogleNetHttpTransport.newTrustedTransport();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections
                            .singletonList("YOUR_CLIENT_ID_HERE")) // you should add your client id you got by
                                                                   // generating oauth credentials
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                return ResponseEntity.badRequest().body("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // ✅ 1. Check if user exists, else create a new Google user
            User user = userService.findByEmail(email)
                    .orElseGet(() -> userService.registerGoogleUser(name, email));

            // ✅ 2. Generate JWT for frontend session
            String jwt = jwtService.generateToken(email, user.getRole().name(), user.getDocumentId());

            // ✅ 3. Return JWT + user details to frontend
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Google login failed: " + e.getMessage());
        }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private com.ecovision.backend.model.Role role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public com.ecovision.backend.model.Role getRole() {
            return role;
        }

        public void setRole(com.ecovision.backend.model.Role role) {
            this.role = role;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class TokenRequest {
        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public static class LoginResponse {
        private String token;
        private String email;
        private String role;
        private String documentId;

        public LoginResponse(String token, String email, String role, String documentId) {
            this.token = token;
            this.email = email;
            this.role = role;
            this.documentId = documentId;

        }

        public String getToken() {
            return token;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public String getDocumentId() {
            return documentId;
        }
    }
}
