package com.stockflow.health;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.stockflow.config.SecurityConfig;
import com.stockflow.shared.error.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Teste de fatia web (sem banco): valida segurança deny-by-default e o contrato do health check. */
@WebMvcTest(HealthController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class HealthControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    DatabaseHealthService databaseHealth;

    @Test
    void healthIsPublicWhenDatabaseIsUp() throws Exception {
        when(databaseHealth.isUp()).thenReturn(true);

        mvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"));
    }

    @Test
    void healthReportsDegradedWhenDatabaseIsDown() throws Exception {
        when(databaseHealth.isUp()).thenReturn(false);

        mvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DEGRADED"))
                .andExpect(jsonPath("$.database").value("DOWN"));
    }

    @Test
    void anyOtherRouteRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/v1/products")).andExpect(status().isForbidden());
    }
}
