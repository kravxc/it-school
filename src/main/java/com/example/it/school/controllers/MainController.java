package com.example.it.school.controllers;

import com.example.it.school.entity.Cat;
import com.example.it.school.services.AuthService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class MainController {

    public final AuthService authService;

    public MainController(AuthService authService){
        this.authService = authService;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/api/auth")
    public String auth(){
        return authService.auth();
    }

    @GetMapping("/api/main")
    public String mainListener(){
        return "Hello World";
    }

    @GetMapping("/api/cat")
    public String giveCat(){
        Cat cat = new Cat("Barsik", 5, 10);
        try{
            return objectMapper.writeValueAsString(cat);
        }catch (JsonProcessingException e){
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/api/special")
    public String giveSpecialCat(@RequestParam String name){
        Cat cat = new Cat(name, 5, 10);
        try{
            return objectMapper.writeValueAsString(cat);
        }catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
