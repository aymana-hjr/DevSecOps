package com.example.DevSecOps.Controller;

import com.example.DevSecOps.Entity.Product;
import com.example.DevSecOps.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService service;

    @GetMapping
    public List<Product> getProducts(){

        return service.getAllProducts();

    }

    @PostMapping
    public Product addProduct(@RequestBody Product product){

        return service.addProduct(product);

    }

}
