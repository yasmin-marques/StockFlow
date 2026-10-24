package com.stockflow.health;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.stockflow.support.PostgresTestContainer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

/** Integração com PostgreSQL real (Testcontainers): exige Docker disponível. */
@SpringBootTest
@AutoConfigureMockMvc
@Import(PostgresTestContainer.class)
@Testcontainers(disabledWithoutDocker = true)
class HealthEndpointIT {

    @Autowired
    MockMvc mvc;

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void healthIsPublicAndReportsDatabaseUp() throws Exception {
        mvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"));
    }

    @Test
    void flywayAppliedBaselineMigration() {
        String value = jdbc.queryForObject(
                "SELECT value FROM app_metadata WHERE key = 'schema_baseline'", String.class);
        assertThat(value).isEqualTo("1");
    }

    @Test
    void swaggerDocsArePublic() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk());
    }

    @Test
    void unknownRoutesAreDeniedByDefault() throws Exception {
        mvc.perform(get("/api/v1/products")).andExpect(status().isForbidden());
    }
}
