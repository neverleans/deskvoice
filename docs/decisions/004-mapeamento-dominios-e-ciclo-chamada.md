# ADR-004: Mapeamento de Domínios e Ciclo de Vida da Chamada (Call Lifecycle)

- **Status:** Aceito
- **Data:** 2026-09-27
- **Decisores:** Lucas & Antigravity (AI Assistant)

---

## 1. Contexto

Um sistema de atendimento e telefonia empresarial exige rigor no controle de estados de chamadas. Diferente de aplicações CRUD tradicionais, eventos de voz acontecem em tempo real e de forma assíncrona (interrupção pelo cliente, queda de conexão, transferência para outro ramal).

Além disso, é fundamental garantir a integração instantânea entre a telefonia e os dados do cliente (*Screen-Pop*), permitindo que o atendente receba a chamada já contextualizado com o histórico do contato.

---

## 2. Decisão

### 2.1 Máquina de Estados da Chamada (`CallStateMachine`)

A camada de telefonia do DeskVoice implementará os seguintes estados estritos e determinísticos:

| Estado | Descrição | Ações Possíveis |
| :--- | :--- | :--- |
| `IDLE` | Atendente conectado e aguardando eventos. | Discar número, alterar status para Pausa/Almoço. |
| `RINGING_IN` | Chamada entrante sendo notificada (ringtone ativo). | Atender, Recusar (Envia para correio/fila de transbordo). |
| `RINGING_OUT` | Chamada saintesendo discada para cliente externo. | Cancelar discagem. |
| `CONNECTED` | Chamada em curso, fluxo de áudio WebRTC bidirecional ativo. | Silenciar (Mute), Colocar em Espera (Hold), Gravar, Transferir, Encerrar. |
| `ON_HOLD` | Chamada retida com música de espera para o cliente. | Retomar chamada (Resume), Transferir, Encerrar. |
| `TRANSFERRING` | Tentativa de transferência (assistida com consulta prévia ou cega direta). | Concluir transferência, Cancelar e voltar para `CONNECTED`. |
| `WRAP_UP` | Chamada encerrada; atendente em período de pós-atendimento. | Classificar motivo do contato (tabulação), abrir/vincular ticket, concluir. |
| `MISSED / FAILED` | Chamada perdida ou falha de conexão na discagem. | Registro imediato de CDR e retorno automático para `IDLE`. |

### 2.2 Mecanismo de *Screen-Pop*
1. Ao entrar no estado `RINGING_IN`, o frontend recebe o identificador do originador (`callerId`).
2. Uma busca em milissegundos é executada no domínio de CRM.
3. Se o cliente for identificado, o painel contextual exibe:
   - Nome, empresa e cargo.
   - Histórico das últimas 5 interações (chamadas, tickets).
   - Notas internas de alerta (ex: cliente prioritário ou com fatura pendente).
4. Se for um número não cadastrado, o atendente recebe a opção de "Cadastro Rápido em 1-Clique" sem interromper o fluxo de atendimento.

### 2.3 Domínios do Sistema (Bounded Contexts)

Para manter o monorepo desacoplado e testável, o sistema é dividido em 4 domínios:

1. **`Telephony & Realtime`:** Softphone, WebRTC audio streams, SIP signaling, status de ramais e CDR (*Call Detail Records*).
2. **`CRM & Contacts`:** Contatos, empresas, telefones múltiplos, histórico de interações e anotações.
3. **`Desk & Tickets`:** Gestão de chamados, protocolos de atendimento gerados no `WRAP_UP`, status, prioridades e SLAs.
4. **`Analytics & Supervisor`:** Métricas operacionais em tempo real: TMA (Tempo Médio de Atendimento), TME (Tempo Médio de Espera), taxa de abandono e visão de atendentes online.

---

## 3. Consequências

### Positivas
- **Previsibilidade:** Sem bugs de UI com múltiplos botões de ação incompatíveis (ex: não é possível transferir se a chamada não estiver conectada).
- **Métricas Confiáveis:** O estado `WRAP_UP` garante que o tempo de pós-atendimento seja mensurado separadamente da duração real da conversa, gerando relatórios de TMA precisos.
- **Experiência do Atendente:** O *Screen-Pop* elimina a necessidade de perguntar repetidamente os dados do cliente no início da ligação.

### Negativas / Mitigações
- O atendente precisa finalizar a tabulação no `WRAP_UP` antes de receber a próxima ligação. Será implementado um temporizador configurável com auto-conclusão para evitar que atendentes fiquem presos indefinidamente em pós-atendimento.
