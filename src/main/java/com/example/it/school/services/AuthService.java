package com.example.it.school.services;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public String auth(){
        return "auth: true";
    }
}
