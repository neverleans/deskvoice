import type {
  AgentInfo,
  CDRRecord,
  CompanyNumber,
  Customer,
  IncomingCallEvent,
  Ticket,
} from '@deskvoice/shared';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Roberto Alencar',
    company: 'Logística Express Brasil',
    phone: '31988881234',
    email: 'roberto@logisticaexpress.com.br',
    document: '12.345.678/0001-90',
    isVip: true,
    notes: 'Cliente Enterprise. Prioridade máxima em suporte operacional.',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'cust-002',
    name: 'Mariana Duarte',
    company: 'Finanças Tech Ltda',
    phone: '11977774321',
    email: 'mariana.duarte@financastech.com',
    document: '98.765.432/0001-10',
    isVip: false,
    notes: 'Dúvidas frequentes sobre conciliação bancária e integração de API.',
    createdAt: '2025-06-10T08:00:00Z',
    updatedAt: '2026-09-25T11:15:00Z',
  },
  {
    id: 'cust-003',
    name: 'Carlos Eduardo Ramos',
    company: 'Comércio Varejista Ramos',
    phone: '21966669876',
    email: 'carlos@varejoramos.com.br',
    isVip: false,
    createdAt: '2026-02-18T16:20:00Z',
    updatedAt: '2026-09-15T09:40:00Z',
  },
];

export const MOCK_AGENTS: AgentInfo[] = [
  {
    id: 'agt-01',
    name: 'Lucas Atendente',
    email: 'lucas@deskvoice.com',
    extension: '101',
    department: 'Suporte N1',
    role: 'OPERATOR',
    status: 'AVAILABLE',
    statusSince: '08:30',
    callsHandledToday: 14,
    averageTalkTimeSeconds: 195,
    csatScore: 4.9,
  },
  {
    id: 'agt-02',
    name: 'Ana Carolina Dias',
    email: 'ana.dias@deskvoice.com',
    extension: '102',
    department: 'Suporte N1',
    role: 'OPERATOR',
    status: 'IN_CALL',
    statusSince: '11:42',
    callsHandledToday: 18,
    averageTalkTimeSeconds: 220,
    csatScore: 4.7,
  },
  {
    id: 'agt-03',
    name: 'João Pedro Ramos',
    email: 'joao.ramos@deskvoice.com',
    extension: '103',
    department: 'Comercial & Vendas',
    role: 'OPERATOR',
    status: 'PAUSE_LUNCH',
    statusSince: '12:00',
    callsHandledToday: 9,
    averageTalkTimeSeconds: 310,
    csatScore: 4.8,
  },
  {
    id: 'agt-04',
    name: 'Camila Fernandes',
    email: 'camila@deskvoice.com',
    extension: '100',
    department: 'Operações & Supervisão',
    role: 'SUPERVISOR',
    status: 'AVAILABLE',
    statusSince: '08:00',
    callsHandledToday: 4,
    averageTalkTimeSeconds: 145,
    csatScore: 5.0,
  },
];

export const MOCK_NUMBERS: CompanyNumber[] = [
  {
    id: 'num-01',
    number: '(31) 3333-1111',
    label: 'Tronco Principal (Fixo PABX)',
    type: 'LANDLINE',
    channel: 'VOICE',
    assignedQueue: 'Suporte N1',
    status: 'ACTIVE',
    provider: 'Tronco SIP DirectCall',
  },
  {
    id: 'num-02',
    number: '(31) 98888-2222',
    label: 'Linha Direta Comercial',
    type: 'MOBILE',
    channel: 'VOICE',
    assignedQueue: 'Comercial & Vendas',
    status: 'ACTIVE',
    provider: 'Tronco SIP VoipDoBrasil',
  },
  {
    id: 'num-03',
    number: '0800 700 8090',
    label: 'SAC Gratuito Brasil',
    type: 'TOLL_FREE',
    channel: 'VOICE',
    assignedQueue: 'Suporte N1',
    status: 'ACTIVE',
    provider: 'Tronco SIP Embratel',
  },
  {
    id: 'num-04',
    number: '(31) 97777-3333',
    label: 'WhatsApp Oficial Suporte',
    type: 'WHATSAPP',
    channel: 'WHATSAPP',
    assignedQueue: 'Fila Geral de Mensagens',
    status: 'ACTIVE',
    provider: 'Meta Cloud API v20',
  },
];

export const MOCK_INITIAL_CDRS: CDRRecord[] = [
  {
    id: 'cdr-001',
    callId: 'call-101',
    direction: 'INBOUND',
    callerNumber: '(31) 98888-1234',
    calleeNumber: 'Ramal 101',
    agentId: 'agt-01',
    agentName: 'Lucas Atendente',
    queueName: 'Suporte N1',
    startedAt: '2026-09-27T09:12:00Z',
    answeredAt: '2026-09-27T09:12:05Z',
    endedAt: '2026-09-27T09:16:15Z',
    ringDurationSeconds: 5,
    talkDurationSeconds: 250,
    holdDurationSeconds: 30,
    wrapUpDurationSeconds: 20,
    endReason: 'AGENT_HANGUP',
    disposition: 'Suporte Técnico',
  },
  {
    id: 'cdr-002',
    callId: 'call-102',
    direction: 'INBOUND',
    callerNumber: '(11) 97777-4321',
    calleeNumber: 'Ramal 102',
    agentId: 'agt-02',
    agentName: 'Ana Carolina Dias',
    queueName: 'Financeiro',
    startedAt: '2026-09-27T09:45:00Z',
    answeredAt: '2026-09-27T09:45:03Z',
    endedAt: '2026-09-27T09:48:20Z',
    ringDurationSeconds: 3,
    talkDurationSeconds: 197,
    holdDurationSeconds: 0,
    wrapUpDurationSeconds: 15,
    endReason: 'AGENT_HANGUP',
    disposition: 'Financeiro',
  },
  {
    id: 'cdr-003',
    callId: 'call-103',
    direction: 'INBOUND',
    callerNumber: '(21) 96666-9876',
    calleeNumber: 'Ramal 103',
    agentId: 'agt-03',
    agentName: 'João Pedro Ramos',
    queueName: 'Comercial & Vendas',
    startedAt: '2026-09-27T10:15:00Z',
    answeredAt: '2026-09-27T10:15:08Z',
    endedAt: '2026-09-27T10:20:45Z',
    ringDurationSeconds: 8,
    talkDurationSeconds: 337,
    holdDurationSeconds: 45,
    wrapUpDurationSeconds: 30,
    endReason: 'AGENT_HANGUP',
    disposition: 'Comercial',
  },
  {
    id: 'cdr-004',
    callId: 'call-104',
    direction: 'INBOUND',
    callerNumber: '(41) 99111-2233',
    calleeNumber: 'Fila Geral',
    agentId: 'none',
    agentName: 'Sistema (Transbordo)',
    queueName: 'Suporte N1',
    startedAt: '2026-09-27T10:30:00Z',
    endedAt: '2026-09-27T10:30:45Z',
    ringDurationSeconds: 45,
    talkDurationSeconds: 0,
    holdDurationSeconds: 0,
    wrapUpDurationSeconds: 0,
    endReason: 'TIMEOUT_MISSED',
    disposition: 'Chamada Abandonada',
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tkt-101',
    protocol: 'DV-20260927-101',
    customerId: 'cust-001',
    customerName: 'Roberto Alencar',
    agentId: 'agt-01',
    agentName: 'Lucas Atendente',
    status: 'RESOLVED',
    priority: 'HIGH',
    category: 'Suporte Técnico',
    subject: 'Lentidão no envio de webhooks de entrega',
    description: 'Cliente reportou atraso de 15 minutos na notificação de pacotes entregues.',
    createdAt: '2026-09-25T14:10:00Z',
    updatedAt: '2026-09-25T15:00:00Z',
    resolvedAt: '2026-09-25T15:00:00Z',
  },
  {
    id: 'tkt-102',
    protocol: 'DV-20260927-102',
    customerId: 'cust-002',
    customerName: 'Mariana Duarte',
    agentId: 'agt-01',
    agentName: 'Lucas Atendente',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: 'Financeiro',
    subject: 'Segunda via de fatura competência Setembro/2026',
    description: 'Solicitação de reenvio de boleto bancário atualizado.',
    createdAt: '2026-09-26T09:30:00Z',
    updatedAt: '2026-09-26T09:30:00Z',
  },
];

export type IncomingCallListener = (call: IncomingCallEvent) => void;

/**
 * Provedor de Telefonia Simulado (Mock) para Desenvolvimento e Live Demo Pública
 */
export class MockTelephonyProvider {
  private incomingListeners: Set<IncomingCallListener> = new Set();
  private activeCallId: string | null = null;

  public onIncomingCall(callback: IncomingCallListener): () => void {
    this.incomingListeners.add(callback);
    return () => this.incomingListeners.delete(callback);
  }

  /**
   * Dispara uma chamada simulada com dados fictícios ou com cliente conhecido
   */
  public triggerSimulatedCall(customerIndex = 0): IncomingCallEvent {
    const customer = MOCK_CUSTOMERS[customerIndex % MOCK_CUSTOMERS.length];
    const callId = `mock-call-${Date.now().toString(36)}`;
    this.activeCallId = callId;

    const event: IncomingCallEvent = {
      callId,
      callerNumber: customer.phone,
      callerName: customer.name,
      queueId: 'q-support',
      queueName: 'Fila de Suporte N1',
      timestamp: new Date().toISOString(),
    };

    for (const listener of this.incomingListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[MockTelephonyProvider] Erro ao despachar chamada simulada:', err);
      }
    }

    return event;
  }

  public async answerCall(callId: string): Promise<void> {
    if (this.activeCallId !== callId) {
      throw new Error(`Chamada ${callId} não encontrada no mock provider.`);
    }
  }

  public async hangupCall(callId: string): Promise<void> {
    if (this.activeCallId === callId) {
      this.activeCallId = null;
    }
  }
}
