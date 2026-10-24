package com.stockflow.health;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
class DatabaseHealthService {

    private static final Logger log = LoggerFactory.getLogger(DatabaseHealthService.class);

    private final JdbcTemplate jdbc;

    DatabaseHealthService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    boolean isUp() {
        try {
            return Integer.valueOf(1).equals(jdbc.queryForObject("SELECT 1", Integer.class));
        } catch (DataAccessException ex) {
            log.warn("Falha ao consultar o banco de dados no health check", ex);
            return false;
        }
    }
}
