# ADR-002: Stack Tecnológica e Engenharia de Software

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

Para construir uma plataforma de atendimento de alto desempenho (telefonia, CRM em tempo real e tickets), é necessário escolher uma stack com tipagem estrita, baixa latência, consumo eficiente de memória e baixo atrito de desenvolvimento e verificação (em conformidade com os princípios do *AI CODING ENGINEERING OS*).

Foi avaliada a distribuição de responsabilidades entre tecnologias para evitar duplicidade de runtimes no núcleo do sistema, mantendo a flexibilidade para recursos futuros de inteligência artificial de áudio.

---

## 2. Decisão

Adotar a seguinte stack tecnológica distribuída por domínios:

### 2.1 Frontend & Desktop
- **Framework:** SvelteKit (Svelte 5 com Runes) configurado em modo SPA estático (`@sveltejs/adapter-static` com `ssr: false`).
- **Linguagem:** TypeScript.
- **Estilização & Componentes:** Tailwind CSS + shadcn-svelte (`bits-ui`), componentes refinados via Claude Design.
- **Desktop Shell:** Electron (empacotando o build estático do SvelteKit).
- **Motor de Voz no Cliente:** `JsSIP` ou `sip.js` operando fluxos de áudio via WebRTC nativo (`RTCPeerConnection`).

### 2.2 Core Backend
- **Framework:** NestJS (Node.js) com adapter Fastify (para máximo throughput HTTP e baixo consumo de recursos).
- **Linguagem:** TypeScript (compartilhamento de tipos e contratos com o frontend).
- **Comunicação em Tempo Real:** WebSockets Gateway (Socket.IO / ws nativo) para sinalização de eventos, presença de atendentes e *screen-pop* imediato de chamadas.

### 2.3 Persistência, Cache e Filas
- **Banco Relacional:** PostgreSQL.
- **ORM:** Drizzle ORM (tipagem estrita com SQL puro, migrações determinísticas e latência mínima em CDRs de telefonia).
- **Cache & Pub/Sub:** Redis (armazenamento efêmero do status dos atendentes: *Disponível*, *Pausa*, *Ocupado* e sincronização de eventos entre instâncias).
- **Filas Assíncronas:** BullMQ (processamento de tarefas em background como upload de gravações de áudio para S3/MinIO, webhooks e alertas de SLA).

### 2.4 Camada de IA & Processamento de Áudio (Sidecar / Opcional)
- **Framework:** FastAPI (Python), implementado como microsserviço isolado/sidecar apenas quando necessário.
- **Responsabilidade:** Transcrição de chamadas (Whisper / Faster-Whisper), detecção de atividade de voz (Silero VAD) e agentes de voz / sumarização com LLMs. Não interfere no Core CRUD/WebSockets da aplicação principal.

---

## 3. Consequências

### Positivas
- **Eficiência de Memória no Desktop:** SvelteKit não possui overhead de Virtual DOM, mantendo o Electron leve e responsivo.
- **Tipagem End-to-End no Core:** 100% TypeScript no Frontend, Desktop e Core Backend, reduzindo bugs de integração e facilitando a geração de contratos.
- **Separação Clara de Domínios:** O Core Backend não é inflado com dependências de machine learning; o Python fica restrito ao processamento pesado de áudio.
- **Confiabilidade de Banco:** Drizzle ORM permite alta performance em queries analíticas de relatórios e histórico de chamadas.

### Negativas / Mitigações
- SvelteKit em modo Electron requer atenção na configuração de rotas (`hash` ou `history` fallback) no `adapter-static`.
- A integração entre NestJS e o serviço FastAPI de IA exigirá contrato bem definido (OpenAPI ou mensageria via Redis/BullMQ).
