# Arquitetura

## Visão geral

Monorepo com duas aplicações independentes: `backend/` (API REST Spring Boot) e `frontend/` (SPA React). O PostgreSQL é o único armazenamento; Redis, mensageria e AWS estão fora de escopo até serem necessários.

```text
Navegador ── SPA React (nginx) ──HTTP/JSON──> API Spring Boot ──JDBC──> PostgreSQL
```

## Decisões

| Decisão | Motivo |
| --- | --- |
| Monólito modular no backend, pacotes **por funcionalidade** (`health`, `config`, `shared`) | Simplicidade operacional; as próximas entregas adicionam pacotes de domínio (`product`, `stock`, `order`…) sem camadas globais vazias. |
| Spring Boot 3.5 / Java 21 | Versão estável com LTS do Java. |
| **Segurança deny-by-default** (`anyRequest().authenticated()`) | Só `GET /api/v1/health`, `/actuator/health` e a documentação OpenAPI são públicos. Um `UserDetailsService` vazio impede o usuário padrão com senha gerada. CSRF desativado porque a API é stateless e usará tokens no header (Entrega 2). |
| CORS por configuração (`stockflow.cors.allowed-origins`) | Origem do frontend vem de variável de ambiente; sem curingas. |
| Flyway com `ddl-auto: validate` | O schema só muda por migrações versionadas; o Hibernate apenas valida. `V1__baseline.sql` cria `app_metadata` para provar o mecanismo, sem antecipar o domínio. |
| Erro padronizado (`ApiError` + `GlobalExceptionHandler`) | Contrato único (`code`, `message`, `violations`); detalhes internos nunca vazam. `BusinessException` é a base para erros de regra de negócio. |
| Health check próprio + Actuator | `/api/v1/health` informa API e banco (consumido pela sidebar); `/actuator/health` serve aos healthchecks do Docker. |
| Swagger configurável | `SPRINGDOC_ENABLED=false` desliga a documentação em ambientes públicos. |
| Testes: slice `@WebMvcTest` + integração com Testcontainers | O slice roda sempre; a integração (`*IT`, Failsafe) valida Flyway, banco e segurança com PostgreSQL real e é ignorada se não houver Docker. |

### Consistência de estoque (preparação)

Nada implementado ainda. Direção prevista para a Entrega 4: estoque físico/reservado/disponível mantido em transações com bloqueio (otimista com `@Version` e/ou `SELECT … FOR UPDATE`), movimentações imutáveis como livro-razão e restrições `CHECK` no banco como última defesa.

## Frontend

- **Estrutura:** `app/` (providers, navegação, rotas de erro), `components/ui` (design system), `components/layout` (shell), `features/` (módulos de negócio), `lib/` (http, erros, env), `services/` (chamadas à API), `hooks/`, `routes/`, `styles/`.
- **Dados:** TanStack Query para estado de servidor; Axios centralizado em `lib/http.ts`, cujo interceptor converte qualquer falha em `ApiRequestError` (espelha `ApiError` do backend).
- **Rotas:** `createBrowserRouter`; título e breadcrumbs vêm do `handle` da rota. Módulos futuros usam `ModulePlaceholderPage` gerada a partir de `app/navigation.ts`, fonte única da sidebar e dos placeholders. `/componentes` só existe no build de desenvolvimento (importação dinâmica sob `import.meta.env.DEV`).
- **UI:** Radix (Dialog, Tooltip, Toast) fornece foco, teclado e ARIA; o visual é CSS próprio sobre tokens. Select é `<select>` nativo estilizado.
- **Gráficos/animações:** nenhuma biblioteca adicionada. O gráfico do dashboard é SVG simples com dados mockados; a escolha da biblioteca fica para a Entrega 5.
- **Bundle:** o JS único ainda excede 500 kB (aviso do Vite); a divisão por rota será feita quando houver módulos reais.

## Infraestrutura

`compose.yaml` sobe `db` (volume persistente, `pg_isready`), `backend` (espera o banco saudável; healthcheck em `/actuator/health`) e `frontend` (nginx não-root com fallback de SPA). Portas ligadas a `127.0.0.1`; `POSTGRES_PASSWORD` é obrigatório e nunca versionado. A CI (`.github/workflows/ci.yml`) roda `mvnw verify` e lint, typecheck, testes e build do frontend.
