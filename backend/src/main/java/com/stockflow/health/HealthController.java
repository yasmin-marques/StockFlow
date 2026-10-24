package com.stockflow.health;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health")
public class HealthController {

    private final DatabaseHealthService databaseHealth;

    public HealthController(DatabaseHealthService databaseHealth) {
        this.databaseHealth = databaseHealth;
    }

    @GetMapping
    @Operation(summary = "Verifica a disponibilidade da API e do banco de dados")
    public HealthResponse health() {
        boolean databaseUp = databaseHealth.isUp();
        return new HealthResponse(
                databaseUp ? "UP" : "DEGRADED",
                databaseUp ? "UP" : "DOWN",
                Instant.now());
    }

    public record HealthResponse(String status, String database, Instant timestamp) {
    }
}
