# ADR-005: Design System, Ergonomia do Atendente e Gestão de Áudio

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

Operadores de call center e equipes de suporte passam longos períodos (de 6 a 8 horas diárias) interagindo continuamente com o software. Uma interface sobrecarregada, lenta ou com controle deficiente de periféricos de áudio gera estresse operacional, erros no registro de atendimentos e aumento no Tempo Médio de Atendimento (TMA).

Além disso, definiu-se uma estratégia de entrega em fases para o design da interface, priorizando funcionalidade e ergonomia sólidas no início, com posterior enriquecimento estético.

---

## 2. Decisão

### 2.1 Estratégia em Fases para o Design
- **Fase 1 (Fundação Funcional e Ergonômica):** Construir a melhor interface possível desde o início utilizando **Tailwind CSS + shadcn-svelte (`bits-ui`)**, com foco em usabilidade direta, layout responsivo, contrastes acessíveis e performance de renderização.
- **Fase 2 (Enriquecimento Visual com Claude Design):** Em etapa posterior, refinar e sofisticar o design system utilizando o **Claude Design**, introduzindo microinterações avançadas, ilustrações de estado vazio (*empty states*), paletas corporativas personalizadas e animações de transição de alta fidelidade.

### 2.2 Requisitos Ergonômicos Críticos (HCI / UX)
1. **Dark Mode First:** Paleta escura padrão para redução da fadiga ocular em jornadas longas, com suporte a chaveamento para tema claro quando preferido.
2. **Layout Funcional de 3 Colunas:**
   - **Coluna 1 (Navegação & Status):** Discador, status do operador (*Disponível*, *Almoço*, *Treinamento*), filas de atendimento ativas e histórico recente.
   - **Coluna 2 (Área de Trabalho Principal):** Painel da chamada em curso (timer HD, VU meter de volume, botões de ação com cores semânticas: *Mudo*, *Espera*, *Transferência*, *Encerrar*).
   - **Coluna 3 (Painel Contextual de CRM):** Dados do contato (*Screen-Pop*), timeline de atendimentos passados e tela de tabulação pós-atendimento (`WRAP_UP`).
3. **Atalhos Globais de Teclado (Hotkeys):**
   - `Ctrl + Enter` (ou `F8`): Atender chamada entrante.
   - `Ctrl + M`: Alternar silenciamento do microfone (Mute).
   - `Ctrl + H`: Alternar chamada em espera (Hold).
   - `Escape` (ou `Ctrl + End`): Encerrar chamada.

### 2.3 Gerenciamento de Áudio com Saída Dupla (*Dual-Output*)
Para espelhar a operação de centrais corporativas profissionais:
1. **Campainha (Ringer Output):** A campainha de chamada entrante pode ser direcionada para os alto-falantes principais do computador (permitindo que o operador escute a ligação mesmo sem estar com o fone no ouvido).
2. **Voz (Voice Output):** O fluxo de conversa com o cliente é direcionado exclusivamente para o Headset USB.
3. **Microfone (Voice Input):** Entrada de microfone do Headset com monitoramento de nível de volume (VU meter visual) na interface.
4. **Implementação:** Utilização das APIs web de controle de sinks de mídia (`HTMLMediaElement.setSinkId()`).

---

## 3. Consequências

### Positivas
- **Velocidade de Entrega:** Não bloqueia o desenvolvimento da arquitetura e da lógica de voz aguardando a finalização de designs ultra complexos.
- **Confiabilidade Operacional:** O operador sempre sabe se o microfone está ativo, se está mudo e em qual dispositivo o áudio está saindo.
- **Produtividade Aumentada:** Atalhos de teclado reduzem o tempo de reação ao atender chamadas em fila.

### Negativas / Mitigações
- Nem todos os navegadores suportam `setSinkId()` igualmente em conexões não-HTTPS; como o DeskVoice rodará em Electron e na Web com HTTPS/WSS, essa limitação é mitigada.
