# ADR-001: Plataforma de Execução (Web-First com Desktop Shell via Electron)

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

O DeskVoice é um sistema corporativo de atendimento, CRM e telefonia. O sistema atende a três perfis distintos de usuários com necessidades divergentes:

1. **Atendentes/Operadores:** Necessitam de operação contínua de áudio, notificações nativas do sistema operacional (pop-up de chamada sobreposto a outras janelas - *screen pop*), atalhos globais de teclado e presença na bandeja do sistema (*tray*).
2. **Gestores e Administradores:** Necessitam consultar relatórios de SLA/TMA, configurar filas, usuários e permissões, preferindo acesso direto via navegador sem necessidade de instalar arquivos `.exe`.
3. **Avaliadores / Clientes / Recrutadores:** Precisam testar a solução instantaneamente online (ex: `demo.deskvoice.com`) sem atrito de download de instaladores.

---

## 2. Decisão

Adotar uma **arquitetura Web-First empacotada por um Desktop Shell (Electron)**:

1. A interface do usuário é desenvolvida como uma Single Page Application (SPA) desacoplada.
2. O **Electron** atua como wrapper desktop para os atendentes, injetando APIs nativas do sistema operacional (janelas flutuantes, atalhos de teclado, bandeja e controle avançado de periféricos).
3. A mesma base de código de interface pode ser compilada e servida diretamente na **Web (navegador padrão)** para administradores, supervisores e ambiente de demonstração pública.
4. As chamadas nativas de SO são encapsuladas através de uma interface de abstração (`PlatformAdapter`), garantindo que o código de UI nunca dependa rigidamente de bindings do Node.js/Electron.

---

## 3. Consequências

### Positivas
- **Máximo reaproveitamento de código:** Mais de 90% da lógica e componentes de interface são compartilhados entre Web e Desktop.
- **Portfólio e Vendas:** Possibilidade de publicar uma demonstração online funcional imediata na web.
- **Resiliência e Flexibilidade:** Operadores em ambientes corporativos com restrição de instalação de software podem utilizar o sistema pelo navegador.

### Negativas / Mitigações
- Exige disciplina no frontend para não invocar APIs nativas de desktop diretamente sem a camada de abstração `PlatformAdapter`.
- Testes E2E (Playwright) devem cobrir tanto a versão Web quanto o empacotamento Electron.
