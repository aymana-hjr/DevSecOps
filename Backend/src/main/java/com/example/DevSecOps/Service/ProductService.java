package com.example.DevSecOps.Service;

import com.example.DevSecOps.Entity.Product;
import com.example.DevSecOps.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepository repository;

    public List<Product> getAllProducts(){

        return repository.findAll();

    }

    public Product addProduct(Product p){

        return repository.save(p);

    }

}
