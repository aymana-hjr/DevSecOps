package com.example.DevSecOps.Repository;

import com.example.DevSecOps.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}

