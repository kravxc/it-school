package com.example.it.school.controllers;

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

    @GetMapping("/api/main")
    public String mainListener(){
        return "Hello World";
    }


    @PostMapping("/api/special")
    public String giveSpecialCat(@RequestParam String name){
      return "sdfsd";
    }
}
