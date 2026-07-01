package com.example.DevSecOps.Controller;


import com.example.DevSecOps.Entity.User;
import com.example.DevSecOps.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService service;

    @PostMapping("/login-vulnerable")
    public String loginVulnerable(@RequestParam String username, @RequestParam String password){
        User user = service.loginVulnerable(username, password);

        if (user != null){
            return "success";
        }

        return "fail";
    }

    @PostMapping("/login-secure")
    public String loginSecure(@RequestParam String username, @RequestParam String password){
        User user = service.loginSecure(username, password);
        if (user != null){
            return "success";
        }
        return "fail";
    }
}
