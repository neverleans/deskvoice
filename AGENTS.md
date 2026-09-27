# DeskVoice - Agent Operating Guide

Este documento serve como mapa de navegação e contrato de verdade para agentes de IA operando no DeskVoice.

---

## 1. Fontes de Verdade (Source Hierarchy)

- **Comportamento do Produto:** Testes automatizados (Vitest / Playwright), schemas do Drizzle e contratos em `packages/shared`.
- **Arquitetura & Decisões:** [ARCHITECTURE.md](file:///c:/Users/Lucas/Desktop/Meus%20Projetos%20Git/deskvoice/ARCHITECTURE.md) e [docs/decisions/](file:///c:/Users/Lucas/Desktop/Meus%20Projetos%20Git/deskvoice/docs/decisions/README.md).
- **Diretrizes de Qualidade:** [AI CODING ENGINEERING OS](file:///C:/Users/Lucas/Desktop/Meus%20Projetos%20Git/AI%20CODING%20ENGINEERING%20OS).
- **Procedimentos e Skills:** `.claude/skills/` e `.claude/rules/`.

---

## 2. Limites dos Domínios (Bounded Contexts)

- `packages/shared`: Tipos primitivos, eventos, DTOs e a máquina de estados `CallStateMachine`. Não deve conter dependências de banco ou frameworks de UI.
- `packages/mock-engine`: Simulador isolado de telefonia para desenvolvimento sem SIP real e para a Live Demo pública.
- `packages/database`: Schemas Drizzle e migrations SQL. Não deve importar lógica de frontend.
- `apps/web`: Frontend SvelteKit 5 (SPA static). Acesso a APIs de desktop deve ocorrer exclusivamente via `PlatformAdapter`.
- `apps/desktop`: Shell Electron (Main/Preload). Injeta APIs nativas no `PlatformAdapter`.
- `apps/api`: Core Backend NestJS (Fastify, WebSockets Gateway, Drizzle, Redis, BullMQ).

---

## 3. Antes de Concluir Tarefas

- Execute o harness de verificação: `pnpm verify`.
- Valide mudanças de UI com navegador / Playwright.
- Certifique-se de que nenhum teste de regressão falhou.
- Apresente evidências factuais de execução.
