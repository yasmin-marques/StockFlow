# StockFlow

Sistema full stack de gestão comercial e controle de estoque para pequenas e médias empresas.

> **Status:** Entrega 2 de 5 — navegação, dashboard comercial e experiência da aplicação. O dashboard usa **dados demonstrativos**; nenhum módulo operacional (vendas, estoque…) foi implementado ainda.

## Objetivo

O StockFlow vai gerenciar produtos, clientes, fornecedores, pedidos de compra e venda, movimentações e estoque (físico, reservado e disponível), devoluções, usuários e permissões, indicadores e auditoria. O principal desafio técnico futuro é manter o estoque consistente durante o ciclo de vendas (reservas, cancelamentos e concorrência); a arquitetura atual foi preparada para isso, mas as regras ficam para as próximas entregas.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5, Spring Web / Data JPA / Security / Validation, PostgreSQL 16, Flyway, Springdoc OpenAPI, Maven |
| Frontend | React 19, TypeScript (strict), Vite, React Router, TanStack Query, Axios, React Hook Form, Zod, Lucide, Radix UI (primitivos headless), CSS com tokens |
| Testes | JUnit 5, Mockito, Testcontainers; Vitest + Testing Library |
| Infra | Docker, Docker Compose, GitHub Actions |

## Estrutura do repositório

```text
backend/    API Spring Boot (config, health, shared/error, migrações Flyway)
frontend/   SPA React (app, components/ui, components/layout, features, lib, routes, services, styles)
docs/       architecture.md e design-system.md
.github/    workflow de CI
compose.yaml, .env.example
```

## Pré-requisitos

- Java 21 (o Maven Wrapper `backend/mvnw` baixa o Maven)
- Node.js 22+ e npm
- Docker (PostgreSQL local, Testcontainers e Docker Compose)

## Execução com Docker Compose

```bash
cp .env.example .env        # defina POSTGRES_PASSWORD
docker compose up -d --build
```

| Serviço | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| API (health) | http://localhost:8080/api/v1/health |
| Swagger UI | http://localhost:8080/swagger-ui.html |

Os dados do PostgreSQL ficam no volume `stockflow-db`. Para parar: `docker compose down` (acrescente `-v` para apagar os dados).

## Execução local (sem containers de aplicação)

```bash
# 1. Banco
docker compose up -d db

# 2. Backend (Linux/macOS: exporte as variáveis; Windows PowerShell: $env:DB_PASSWORD="...")
cd backend
DB_PASSWORD=<mesma senha do .env> ./mvnw spring-boot:run

# 3. Frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Variáveis de ambiente

Documentadas em [`.env.example`](.env.example). Backend: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`, `SPRINGDOC_ENABLED`, `SERVER_PORT`. Frontend: `VITE_API_BASE_URL` e `VITE_DASHBOARD_SOURCE` (`mock` padrão | `api`; ver `frontend/.env.example`). Nenhum segredo é versionado; `.env` está no `.gitignore`.

## Testes

```bash
cd backend  && ./mvnw verify      # unitários + integração (integração exige Docker; sem Docker é ignorada)
cd frontend && npm run lint && npm run typecheck && npm test && npm run build
```

## Documentação

- [Arquitetura](docs/architecture.md)
- [Dashboard: origem dos dados, período e contrato da API](docs/dashboard.md)
- [Design system](docs/design-system.md) — a rota `/componentes` (somente `npm run dev`) mostra todos os componentes.
- Swagger UI em `/swagger-ui.html` (liberado apenas para leitura; desative com `SPRINGDOC_ENABLED=false`).

## Situação atual

Implementado: backend com segurança deny-by-default, health check, Flyway, erro padronizado, OpenAPI; frontend com sidebar agrupada e recolhível, topbar com breadcrumbs, busca global (páginas e módulos), notificações (demonstrativas), dashboard comercial com filtro de período na URL e gráficos (Recharts), páginas de indisponibilidade para os módulos futuros; Docker e CI.

Não implementado (por escopo): autenticação, usuários, CRUDs, pedidos, estoque, relatórios, auditoria e endpoints do dashboard (o contrato está documentado).

## Roadmap

1. **Fundação e design system** — concluída.
2. **Navegação e dashboard comercial** — esta entrega (dados demonstrativos).
3. Autenticação, usuários e papéis; catálogo e cadastros (produtos, categorias, clientes, fornecedores).
4. Estoque e pedidos: movimentações, reservas, vendas, compras, devoluções e concorrência; endpoints reais do dashboard.
5. Relatórios, auditoria e endurecimento.
