package com.lifeos.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
public class LifeosBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeosBackendApplication.class, args);
    }
}

@RestController
class StatusController {

    @GetMapping("/")
    public Map<String, String> status() {
        return Map.of(
                "service", "LifeOS Backend",
                "status", "running",
                "message", "LifeOS API is alive."
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
