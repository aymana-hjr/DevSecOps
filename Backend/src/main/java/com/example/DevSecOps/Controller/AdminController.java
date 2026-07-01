package com.example.DevSecOps.Controller;

import com.example.DevSecOps.Entity.User;
import com.example.DevSecOps.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserRepository repository;

    @GetMapping
    public String admin(@RequestParam String username){

        User user=repository.findByUsername(username).orElse(null);

        if(user==null){

            return "Utilisateur inexistant";

        }

        if(user.getRole().equals("ADMIN")){

            return "Bienvenue Administrateur";

        }

        return "Accès refusé";

    }

}