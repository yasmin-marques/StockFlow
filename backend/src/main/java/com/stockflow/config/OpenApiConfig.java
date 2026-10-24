package com.stockflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI stockFlowOpenApi() {
        return new OpenAPI().info(new Info()
                .title("StockFlow API")
                .description("API de gestão comercial e controle de estoque.")
                .version("0.1.0"));
    }
}
