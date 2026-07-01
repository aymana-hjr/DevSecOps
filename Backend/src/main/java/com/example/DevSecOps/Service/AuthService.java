package com.example.DevSecOps.Service;

import com.example.DevSecOps.Entity.User;
import com.example.DevSecOps.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;

@Service
public class AuthService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private UserRepository repository;

    // =======================
    // Version vulnérable
    // =======================
    public User loginVulnerable(String username,String password){

        try{

            Connection con=dataSource.getConnection();

            Statement st=con.createStatement();

            String sql = "SELECT * FROM users WHERE username='"
                    + username +
                    "' AND password='"
                    + password + "'";

            System.out.println("SQL = " + sql);

            ResultSet rs = st.executeQuery(sql);

            if(rs.next()){

                User u=new User();

                u.setId(rs.getLong("id"));
                u.setUsername(rs.getString("username"));
                u.setPassword(rs.getString("password"));
                u.setRole(rs.getString("role"));

                return u;

            }

        }catch(Exception e){
            e.printStackTrace();
        }

        return null;

    }

    // ======================
    // Version sécurisée
    // ======================

    public User loginSecure(String username,String password){

        return repository
                .findByUsernameAndPassword(username,password)
                .orElse(null);

    }

}