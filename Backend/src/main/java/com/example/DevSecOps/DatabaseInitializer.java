package com.example.DevSecOps;

import com.example.DevSecOps.Entity.Product;
import com.example.DevSecOps.Entity.User;
import com.example.DevSecOps.Repository.ProductRepository;
import com.example.DevSecOps.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialiser les utilisateurs par défaut
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin", "admin123", "ADMIN"));
            userRepository.save(new User(null, "user", "user123", "USER"));
            System.out.println(">>> Base de données : Utilisateurs par défaut créés.");
        }

        // Initialiser les produits par défaut
        if (productRepository.count() == 0) {
            productRepository.save(new Product(null, "Laptop CyberSec 15", 1499.99, "PC portable hautes performances pour les tests d'intrusion."));
            productRepository.save(new Product(null, "Clé de sécurité FIDO2", 49.99, "Clé matérielle pour authentification multifacteur ultra-sécurisée."));
            productRepository.save(new Product(null, "Routeur Wi-Fi Firewall", 199.50, "Routeur avec pare-feu matériel intégré pour réseau local sécurisé."));
            System.out.println(">>> Base de données : Produits par défaut créés.");
        }
    }
}
