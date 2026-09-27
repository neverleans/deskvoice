# DeskVoice - Instruções Operacionais

> **Diretriz Central do AI Coding Engineering OS:**
> Código não é evidência suficiente. Uma alteração só é considerada concluída quando acompanhada da verificação correspondente ao risco da mudança.

---

## 1. Documentação Obrigatória de Leitura

Antes de planejar ou alterar código:
- Leia [ARCHITECTURE.md](file:///c:/Users/Lucas/Desktop/Meus%20Projetos%20Git/deskvoice/ARCHITECTURE.md) para o mapa de sistemas e limites arquiteturais.
- Consulte [docs/decisions/](file:///c:/Users/Lucas/Desktop/Meus%20Projetos%20Git/deskvoice/docs/decisions/README.md) para as decisões de arquitetura aceitas (ADR-001 a ADR-006).
- Consulte [docs/index.md](file:///c:/Users/Lucas/Desktop/Meus%20Projetos%20Git/deskvoice/docs/index.md) para o catálogo de contratos e guias.

---

## 2. Comandos do Harness de Desenvolvimento

```bash
# Instalação de dependências do monorepo
pnpm install

# Execução em desenvolvimento
pnpm dev              # Inicia apps/web e apps/api em paralelo
pnpm dev:web          # Apenas frontend SvelteKit (modo SPA/Demo)
pnpm dev:desktop      # Shell Electron carregando o frontend local
pnpm dev:api          # Core Backend NestJS

# Verificação Estática e Qualidade
pnpm check            # Type-check TypeScript (tsc --noEmit) + svelte-check
pnpm lint             # Linter ESLint

# Suíte de Testes
pnpm test             # Testes unitários com Vitest em todos os workspaces
pnpm test:e2e         # Testes Playwright (Golden Path de atendimento e chamada)

# Verificação Rápida Obrigatória antes de declarar conclusão
pnpm verify           # Executa check + lint + test
```

---

## 3. Fluxo de Mudança (Change Workflow)

1. **Investigar:** Inspecione o código relevante, contratos e testes existentes.
2. **Identificar Invariantes:** Não quebre a máquina de estados de chamadas (`CallStateMachine`) nem os fluxos de pós-atendimento (`WRAP_UP`).
3. **Planejar:** Defina o menor incremento seguro verificável.
4. **Implementar:** Escreva a alteração de forma modular.
5. **Verificar:** Execute `pnpm check` e `pnpm test`. Para alterações de UI, use verificação de navegador/Playwright.
6. **Reportar com Evidências:** Declare exatamente o que foi executado e verificado, sem assumir funcionamento apenas pela leitura do código.

---

## 4. Segurança e Regras de Produção

- Nunca versione credenciais, tokens SIP ou senhas de banco; utilize `.env.example`.
- Modificações em schemas de banco de dados devem ser geradas e validadas via Drizzle Migrations (`pnpm db:generate`).
- Não altere as restrições da licença BSL 1.1 em `LICENSE.md`.
