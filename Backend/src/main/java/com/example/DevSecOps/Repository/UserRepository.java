package com.example.DevSecOps.Repository;

import com.example.DevSecOps.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsernameAndPassword(String username,String password);

    Optional<User> findByUsername(String username);

}
