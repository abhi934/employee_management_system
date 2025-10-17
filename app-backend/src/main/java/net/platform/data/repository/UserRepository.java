package net.platform.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import net.platform.data.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
}

