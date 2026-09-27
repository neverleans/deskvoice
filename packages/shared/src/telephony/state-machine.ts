import type { CallDirection, CallEndReason, CallSession, CallState, IncomingCallEvent } from './types.js';

export type StateChangeCallback = (session: CallSession | null, previousState: CallState) => void;

/**
 * Máquina de Estados da Chamada conforme ADR-004
 * Garante que transições ilegais não ocorram e controla o ciclo de vida completo.
 */
export class CallStateMachine {
  private currentSession: CallSession | null = null;
  private listeners: Set<StateChangeCallback> = new Set();

  public get session(): CallSession | null {
    return this.currentSession;
  }

  public get state(): CallState {
    return this.currentSession?.state ?? 'IDLE';
  }

  public subscribe(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(previousState: CallState): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentSession, previousState);
      } catch (err) {
        console.error('[CallStateMachine] Erro no listener:', err);
      }
    }
  }

  /**
   * Recebe chamada entrante (toca no softphone)
   */
  public ringIncoming(event: IncomingCallEvent): CallSession {
    if (this.state !== 'IDLE') {
      throw new Error(`Não é possível receber chamada no estado ${this.state}. Atendente ocupado.`);
    }

    const previous = this.state;
    this.currentSession = {
      callId: event.callId,
      direction: 'INBOUND',
      state: 'RINGING_IN',
      remoteNumber: event.callerNumber,
      remoteName: event.callerName,
      startedAt: new Date(event.timestamp),
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: false,
    };

    this.notify(previous);
    return this.currentSession;
  }

  /**
   * Inicia discagem de chamada sainte
   */
  public startOutgoing(callId: string, destinationNumber: string, destinationName?: string): CallSession {
    if (this.state !== 'IDLE') {
      throw new Error(`Não é possível discar no estado ${this.state}. Atendente ocupado.`);
    }

    const previous = this.state;
    this.currentSession = {
      callId,
      direction: 'OUTBOUND',
      state: 'RINGING_OUT',
      remoteNumber: destinationNumber,
      remoteName: destinationName,
      startedAt: new Date(),
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: false,
    };

    this.notify(previous);
    return this.currentSession;
  }

  /**
   * Atende a chamada entrante
   */
  public answer(): void {
    if (!this.currentSession || this.currentSession.state !== 'RINGING_IN') {
      throw new Error(`Não é possível atender chamada fora do estado RINGING_IN (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'CONNECTED';
    this.currentSession.connectedAt = new Date();
    this.notify(previous);
  }

  /**
   * Cliente remoto atendeu chamada discada
   */
  public remoteAnswer(): void {
    if (!this.currentSession || this.currentSession.state !== 'RINGING_OUT') {
      throw new Error(`Não é possível conectar chamada fora do estado RINGING_OUT (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'CONNECTED';
    this.currentSession.connectedAt = new Date();
    this.notify(previous);
  }

  /**
   * Coloca a chamada em espera (Hold)
   */
  public hold(): void {
    if (!this.currentSession || this.currentSession.state !== 'CONNECTED') {
      throw new Error(`Apenas chamadas conectadas podem ser colocadas em espera (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'ON_HOLD';
    this.currentSession.isOnHold = true;
    this.notify(previous);
  }

  /**
   * Retoma a chamada em espera
   */
  public resume(): void {
    if (!this.currentSession || this.currentSession.state !== 'ON_HOLD') {
      throw new Error(`Chamada não está em espera para ser retomada (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'CONNECTED';
    this.currentSession.isOnHold = false;
    this.notify(previous);
  }

  /**
   * Alterna mudo do microfone
   */
  public toggleMute(): boolean {
    if (!this.currentSession || (this.currentSession.state !== 'CONNECTED' && this.currentSession.state !== 'ON_HOLD')) {
      throw new Error(`Não é possível alterar microfone fora de chamada ativa (atual: ${this.state})`);
    }

    this.currentSession.isMuted = !this.currentSession.isMuted;
    this.notify(this.currentSession.state);
    return this.currentSession.isMuted;
  }

  /**
   * Inicia transferência de chamada
   */
  public startTransfer(): void {
    if (!this.currentSession || this.currentSession.state !== 'CONNECTED') {
      throw new Error(`Transferência só pode ser iniciada com chamada conectada (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'TRANSFERRING';
    this.notify(previous);
  }

  /**
   * Cancela transferência de chamada e retorna ao estado conectado
   */
  public cancelTransfer(): void {
    if (!this.currentSession || this.currentSession.state !== 'TRANSFERRING') {
      throw new Error(`Nenhuma transferência em andamento para cancelar (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    this.currentSession.state = 'CONNECTED';
    this.notify(previous);
  }

  /**
   * Desliga/Encerra a chamada em curso e encaminha para pós-atendimento (WRAP_UP)
   */
  public hangup(_reason: CallEndReason = 'AGENT_HANGUP'): void {
    if (!this.currentSession) {
      throw new Error('Nenhuma chamada em andamento para encerrar.');
    }

    const previous = this.currentSession.state;

    // Se estiver apenas tocando, encerra direto sem pós-atendimento
    if (previous === 'RINGING_IN' || previous === 'RINGING_OUT') {
      this.currentSession.state = 'TERMINATED';
      this.currentSession.endedAt = new Date();
      this.notify(previous);
      return;
    }

    // Se a chamada estava em conversa ativa ou espera, entra em WRAP_UP (tabulação)
    if (previous === 'CONNECTED' || previous === 'ON_HOLD' || previous === 'TRANSFERRING') {
      this.currentSession.state = 'WRAP_UP';
      this.currentSession.endedAt = new Date();
      this.notify(previous);
      return;
    }

    throw new Error(`Estado inválido para hangup: ${previous}`);
  }

  /**
   * Conclui a tabulação pós-atendimento e retorna o atendente para IDLE (Repouso)
   */
  public completeWrapUp(notes?: string): void {
    if (!this.currentSession || this.currentSession.state !== 'WRAP_UP') {
      throw new Error(`Só é possível concluir pós-atendimento no estado WRAP_UP (atual: ${this.state})`);
    }

    const previous = this.currentSession.state;
    if (notes) {
      this.currentSession.notes = notes;
    }
    this.currentSession.state = 'TERMINATED';
    this.notify(previous);

    // Retorna para repouso
    this.currentSession = null;
    this.notify('TERMINATED');
  }

  /**
   * Reseta o estado forçadamente para IDLE (recuperação de erros)
   */
  public reset(): void {
    const previous = this.state;
    this.currentSession = null;
    this.notify(previous);
  }
}
