-- Baseline da infraestrutura: registra a versão do schema e valida que o Flyway está operando.
-- O modelo de domínio (produtos, pedidos, estoque) será introduzido nas próximas entregas.
CREATE TABLE app_metadata (
    key        VARCHAR(100) PRIMARY KEY,
    value      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO app_metadata (key, value) VALUES ('schema_baseline', '1');
