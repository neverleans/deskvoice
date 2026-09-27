# ADR-003: Estrutura de Monorepo, Licença BSL e Estratégia de Demonstração

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

O DeskVoice precisa atingir dois objetivos aparentemente conflitantes:
1. **Vitrine Técnica e Portfólio:** O código precisa estar público no GitHub para que recrutadores, empresas e clientes vejam a qualidade da arquitetura, das abstrações e do design system em Svelte 5 + TypeScript.
2. **Proteção Comercial:** Evitar que terceiros e concorrentes simplesmente clonem o repositório e comercializem o software sem autorização ou contrapartida financeira.
3. **Acesso Sem Barreiras (Live Demo):** Permitir que qualquer avaliador teste a experiência completa de uma central de atendimento (inclusive chamadas) sem a necessidade de contratar números DID ou troncos SIP caros.

---

## 2. Decisão

### 2.1 Visibilidade e Licenciamento (BSL 1.1)
- O repositório será mantido **Público no GitHub**.
- Adotar a licença **Business Source License (BSL 1.1)** ou **PolyForm Noncommercial**:
  - Permite visualização, inspeção, forks pessoais, testes e contribuições comunitárias.
  - **Proíbe expressamente o uso comercial concorrente** e a revenda do sistema sem contratação de licença comercial direta com o autor.
  - Modelo idêntico ao adotado por empresas como Sentry, CockroachDB e MariaDB.

### 2.2 Estrutura do Monorepo (`pnpm workspaces`)
Organização modular para separação estrita de domínios:

```text
deskvoice/
├── apps/
│   ├── web/          # Aplicação SvelteKit (SPA, UI, Páginas, Stores, Design System)
│   ├── desktop/      # Shell Electron (Preload scripts, Window management, Tray, Audio IPC)
│   └── api/          # Core Backend NestJS (Auth, CRM, WebSockets, Filas, Drizzle)
│
├── packages/
│   ├── shared/       # Contratos, tipos TypeScript compartilhados, DTOs e eventos
│   ├── database/     # Schemas Drizzle ORM, migrações SQL e seeds
│   └── mock-engine/  # Simulador de telefonia, chamadas em fila e eventos em tempo real
│
├── docs/             # ADRs, especificações, arquitetura C4 e runbooks
```

### 2.3 Estratégia de Demonstração Pública (`mock-engine`)
- A camada de telefonia dependerá de uma interface (`ITelephonyProvider`).
- Em ambiente de demonstração (`VITE_DEMO_MODE=true`), a interface utiliza o `MockTelephonyProvider`.
- Permite deploy da aplicação Web em plataformas como Vercel/Cloudflare Pages com:
  - Disparo de chamadas fictícias simuladas para teste imediato.
  - Simulação de pop-up de cliente na tela (*screen-pop*).
  - Controle de chamadas (atender, silenciar, colocar em espera, desligar).
  - Cronômetro e pós-atendimento (tabulação do chamado).

---

## 3. Consequências

### Positivas
- **Máximo Impacto Profissional:** O repositório público demonstra capacidade técnica completa (código, testes, arquitetura e interface).
- **Proteção Jurídica:** Concorrentes não podem monetizar o produto legalmente devido à BSL.
- **Testabilidade Imediata:** Clientes e recrutadores testam o sistema via web browser com um único clique na Live Demo.

### Negativas / Mitigações
- Exige atenção redigida no arquivo `LICENSE.md` para deixar explícitos os termos da BSL.
- O código da interface fica legível (o que é normal no desenvolvimento web), mas protegido pela licença e pelo desacoplamento das regras de negócio do backend corporativo.
