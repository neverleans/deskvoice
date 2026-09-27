# ADR-006: Estratégia de Verificação, Testes e Qualidade (Alinhado ao AI Coding OS)

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

Aplicações de telefonia e atendimento em tempo real possuem alta criticidade operacional: se um atendente não conseguir atender uma chamada ou se o cronômetro travar, o impacto no cliente e no SLA é imediato.

Conforme os princípios estabelecidos no **AI CODING ENGINEERING OS** (especialmente o princípio *2.1: Código não é evidência suficiente* e *2.6: Camada de verificação independente*), o DeskVoice deve possuir um *test harness* reproduzível, automatizado e determinístico, onde nenhuma funcionalidade é considerada concluída sem evidência executável.

---

## 2. Decisão

Adotar uma pirâmide de verificação estruturada em 4 camadas independentes:

### 2.1 Análise Estática & Type-Checking (Verificação Rápida)
- **TypeScript:** `tsc --noEmit` em todos os workspaces (Web, Desktop, API, Shared).
- **Svelte:** `svelte-check` para integridade de templates e tipagem de props/runes.
- **Linters & Formatação:** ESLint e Prettier padronizados no monorepo.

### 2.2 Testes Unitários e Determinísticos (Vitest)
- Foco em regras de negócio puras e sem efeitos colaterais de I/O:
  - Transições da máquina de estados (`CallStateMachine`): validar se transições inválidas disparam erros controlados.
  - Temporizadores de chamadas e formatação de duração (`HH:MM:SS`).
  - Cálculo de métricas operacionais (TMA, TME e conformidade com SLA).
  - Normalização e validação de números de telefone nacionais e internacionais (E.164).

### 2.3 Testes de Integração & Contratos (API NestJS + Drizzle)
- Validação de rotas HTTP e WebSockets contra instâncias de teste do PostgreSQL e Redis (via contêineres Docker ou banco isolado de teste).
- Testes de concorrência: assegurar que duas chamadas simultâneas não corrompam o estado do mesmo ramal.
- Validação das migrações do Drizzle ORM (`drizzle-kit check`).

### 2.4 Teste E2E do Fluxo Crítico (*Golden Path* com Playwright)
Automação de ponta a ponta simulando a experiência real do operador com o navegador:
1. Operador entra na interface e visualiza status `Disponível`.
2. O `mock-engine` dispara uma chamada simulada com número de telefone conhecido.
3. O Playwright valida a abertura imediata do modal de *Screen-Pop* com o nome do cliente correto.
4. O teste executa o atendimento (via clique ou atalho de teclado `F8`).
5. Validação de áudio/timer ativo e interface de chamada conectada.
6. Encerramento da chamada pelo operador.
7. Tela de pós-atendimento (`WRAP_UP`): seleção do motivo da tabulação e preenchimento de observações.
8. Envio da tabulação, retorno ao repouso (`IDLE`) e validação da inserção do registro no histórico (CDR).

### 2.5 Governança de Agentes (`CLAUDE.md` e `AGENTS.md`)
O repositório incluirá na raiz as instruções contratuais derivadas do *AI Coding Engineering OS*, estabelecendo que agentes de IA nunca declarem conclusão de tarefas baseando-se apenas na inspeção visual de diffs, exigindo sempre a execução dos comandos de verificação correspondentes ao risco da mudança.

---

## 3. Consequências

### Positivas
- **Imunidade a Regressões:** O Golden Path E2E garante que refatorações na UI ou no SvelteKit não quebrem o fluxo essencial de atendimento.
- **Evidências Claras:** Qualquer PR ou contribuição no repositório público terá comprovação automatizada via CI (GitHub Actions).
- **Alinhamento Metodológico:** Total conformidade com as melhores práticas de engenharia de software do *AI Coding Engineering OS*.

### Negativas / Mitigações
- Testes E2E com WebRTC e simulação de áudio demandam flags específicas no Playwright (ex: `--use-fake-ui-for-media-stream`, `--use-fake-device-for-media-stream`), que serão configuradas no harness do projeto.
