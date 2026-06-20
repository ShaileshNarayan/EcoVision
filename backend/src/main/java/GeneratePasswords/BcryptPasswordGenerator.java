package GeneratePasswords;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptPasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "driver2"; // replace this and generate bcrypt hash for any password you want
        String hashed = encoder.encode(password);

        System.out.println("Plain : " + password);
        System.out.println("Hash  : " + hashed);
    }
}
