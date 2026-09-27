import {
  CallStateMachine,
  type AgentInfo,
  type CallEndReason,
  type CallSession,
  type CallState,
  type CDRRecord,
  type CompanyNumber,
  type Customer,
  type IncomingCallEvent,
  type Ticket,
  type TicketStatus,
  type UserRole,
  type WrapUpData,
} from '@deskvoice/shared';
import {
  MOCK_AGENTS,
  MOCK_CUSTOMERS,
  MOCK_INITIAL_CDRS,
  MOCK_NUMBERS,
  MOCK_TICKETS,
  MockTelephonyProvider,
} from '@deskvoice/mock-engine';
import { sounds } from '../audio/chime.js';
import { getPlatformAdapter } from '../platform/platform-adapter.js';

export type AgentStatus = 'AVAILABLE' | 'BUSY' | 'PAUSE_LUNCH' | 'PAUSE_TRAINING' | 'OFFLINE';
export type AppView = 'calls' | 'crm' | 'tickets' | 'reports' | 'team' | 'settings';

export class TelephonyStore {
  private fsm = new CallStateMachine();
  private mockProvider = new MockTelephonyProvider();
  private platform = getPlatformAdapter();
  private timerInterval: number | null = null;

  // Svelte 5 Runes State: Sessão & Telefonia
  session = $state<CallSession | null>(null);
  state = $state<CallState>('IDLE');
  agentStatus = $state<AgentStatus>('AVAILABLE');
  currentCustomer = $state<Customer | null>(null);
  elapsedSeconds = $state<number>(0);

  // Svelte 5 Runes State: Navegação e Papéis (Demo Switcher)
  activeView = $state<AppView>('calls');
  userRole = $state<UserRole>('OPERATOR');

  // Estado de Supervisão em Tempo Real (Escuta, Sussurro, Intervenção)
  activeMonitoring = $state<{
    agentName: string;
    extension: string;
    mode: 'LISTEN' | 'WHISPER' | 'BARGE';
  } | null>(null);

  // Dados Centrais da Plataforma
  customers = $state<Customer[]>(MOCK_CUSTOMERS);
  tickets = $state<Ticket[]>(MOCK_TICKETS);
  cdrHistory = $state<CDRRecord[]>(MOCK_INITIAL_CDRS);
  agents = $state<AgentInfo[]>(MOCK_AGENTS);
  numbers = $state<CompanyNumber[]>(MOCK_NUMBERS);

  // Duração formatada reativa (Runes: $derived)
  formattedDuration = $derived.by(() => {
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  constructor() {
    this.fsm.subscribe((session, _prev) => {
      this.session = session ? { ...session } : null;
      this.state = this.fsm.state;
    });

    this.mockProvider.onIncomingCall((event) => {
      this.handleIncomingCall(event);
    });
  }

  private handleIncomingCall(event: IncomingCallEvent) {
    if (this.agentStatus !== 'AVAILABLE') return;

    // 1. Atualiza FSM
    this.fsm.ringIncoming(event);

    // 2. Screen-Pop: Identifica cliente pelo número
    const found = this.customers.find((c) => c.phone.includes(event.callerNumber) || event.callerNumber.includes(c.phone));
    this.currentCustomer = found || {
      id: `anon-${Date.now()}`,
      name: event.callerName || `Chamador (${event.callerNumber})`,
      phone: event.callerNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Se estiver em outra tela, traz para a tela de chamadas
    if (this.activeView !== 'calls') {
      this.activeView = 'calls';
    }

    // 3. Notificação nativa e som de campainha
    sounds.startRingtone();
    this.platform.notify('📞 Chamada Recebida - DeskVoice', {
      body: `${this.currentCustomer.name} (${event.callerNumber}) está ligando...`,
    });
    this.platform.setTrayBadge(1);
    this.platform.bringToFront();
  }

  public answer() {
    sounds.stopRingtone();
    this.fsm.answer();
    this.startTimer();
    this.platform.setTrayBadge(0);
  }

  public hangup(reason: CallEndReason = 'AGENT_HANGUP') {
    sounds.stopRingtone();
    this.stopTimer();
    this.fsm.hangup(reason);
    this.platform.setTrayBadge(0);
  }

  public toggleMute() {
    this.fsm.toggleMute();
    this.session = this.fsm.session ? { ...this.fsm.session } : null;
  }

  public toggleHold() {
    if (this.state === 'CONNECTED') {
      this.fsm.hold();
    } else if (this.state === 'ON_HOLD') {
      this.fsm.resume();
    }
    this.session = this.fsm.session ? { ...this.fsm.session } : null;
  }

  public completeWrapUp(data: WrapUpData) {
    const talkSecs = this.elapsedSeconds;
    const callId = this.session?.callId || `call-${Date.now()}`;
    const callerNum = this.session?.remoteNumber || 'Desconhecido';

    // Cria ticket se selecionado
    if (data.createTicket && this.currentCustomer) {
      const newTicket: Ticket = {
        id: `tkt-${Date.now()}`,
        protocol: `DV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: this.currentCustomer.id,
        customerName: this.currentCustomer.name,
        agentId: 'agt-01',
        agentName: 'Lucas Atendente',
        status: 'OPEN',
        priority: data.ticketPriority || 'MEDIUM',
        category: data.category,
        subject: data.ticketSubject || `Atendimento telefônico: ${data.category}`,
        description: data.notes,
        callId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.tickets = [newTicket, ...this.tickets];
    }

    // Registra CDR
    const cdr: CDRRecord = {
      id: `cdr-${Date.now()}`,
      callId,
      direction: 'INBOUND',
      callerNumber: callerNum,
      calleeNumber: 'Ramal 101',
      agentId: 'agt-01',
      agentName: 'Lucas Atendente',
      queueName: 'Fila Geral de Suporte',
      startedAt: this.session?.startedAt?.toISOString() || new Date().toISOString(),
      answeredAt: this.session?.connectedAt?.toISOString(),
      endedAt: new Date().toISOString(),
      ringDurationSeconds: 4,
      talkDurationSeconds: talkSecs,
      holdDurationSeconds: 0,
      wrapUpDurationSeconds: 15,
      endReason: 'AGENT_HANGUP',
      disposition: data.category,
    };
    this.cdrHistory = [cdr, ...this.cdrHistory];

    this.fsm.completeWrapUp(data.notes);
    this.elapsedSeconds = 0;
    this.currentCustomer = null;
  }

  public simulateIncomingCall(customerIndex = 0) {
    if (this.state !== 'IDLE') return;
    this.mockProvider.triggerSimulatedCall(customerIndex);
  }

  public addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      ...customer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers = [newCust, ...this.customers];
    return newCust;
  }

  public updateTicketStatus(ticketId: string, status: TicketStatus) {
    this.tickets = this.tickets.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  }

  public addCompanyNumber(num: Omit<CompanyNumber, 'id'>) {
    const newNum: CompanyNumber = {
      id: `num-${Date.now()}`,
      ...num,
    };
    this.numbers = [...this.numbers, newNum];
  }

  public setRole(role: UserRole) {
    this.userRole = role;
    if (role === 'OPERATOR') {
      this.activeView = 'calls';
    } else if (role === 'SUPERVISOR') {
      this.activeView = 'team';
    } else if (role === 'ADMIN') {
      this.activeView = 'settings';
    }
  }

  public startMonitoring(agent: AgentInfo, mode: 'LISTEN' | 'WHISPER' | 'BARGE') {
    this.activeMonitoring = {
      agentName: agent.name,
      extension: agent.extension,
      mode,
    };
  }

  public stopMonitoring() {
    this.activeMonitoring = null;
  }

  private startTimer() {
    this.elapsedSeconds = 0;
    this.stopTimer();
    this.timerInterval = window.setInterval(() => {
      this.elapsedSeconds += 1;
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

export const telephony = new TelephonyStore();
