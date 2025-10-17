package net.platform.data.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import net.platform.data.exception.ResourceNotFoundException;
import net.platform.data.model.User;
import net.platform.data.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        return userRepository.findByEmailAndPassword(email, password)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok(response);
                }).orElseThrow(()->new ResourceNotFoundException("User doesn't exist with id:"+email));
    }
    
    
    
}



