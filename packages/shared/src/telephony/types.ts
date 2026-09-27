/**
 * Estados estritos da chamada conforme ADR-004
 */
export type CallState =
  | 'IDLE'            // Repouso / Disponível
  | 'RINGING_IN'      // Chamada entrante tocando
  | 'RINGING_OUT'     // Chamada saintetocando no cliente
  | 'CONNECTED'       // Chamada conectada (áudio bidirecional ativo)
  | 'ON_HOLD'         // Chamada em espera
  | 'TRANSFERRING'    // Transferência em andamento
  | 'WRAP_UP'         // Pós-atendimento / Tabulação
  | 'TERMINATED';     // Chamada concluída / desligada

export type CallDirection = 'INBOUND' | 'OUTBOUND';

export type CallEndReason =
  | 'AGENT_HANGUP'
  | 'REMOTE_HANGUP'
  | 'REJECTED'
  | 'TIMEOUT_MISSED'
  | 'TRANSFERRED'
  | 'NETWORK_ERROR';

/**
 * Tradução amigável em português para exibição nas interfaces
 */
export const CALL_STATE_LABELS: Record<CallState, { label: string; description: string }> = {
  IDLE: { label: 'Disponível', description: 'Pronto para receber chamadas' },
  RINGING_IN: { label: 'Chamando...', description: 'Chamada recebida tocando no ramal' },
  RINGING_OUT: { label: 'Discando...', description: 'Chamando cliente externo' },
  CONNECTED: { label: 'Em Conversa', description: 'Chamada conectada com áudio ativo' },
  ON_HOLD: { label: 'Em Espera', description: 'Chamada em espera com música' },
  TRANSFERRING: { label: 'Transferindo...', description: 'Transferência de chamada em andamento' },
  WRAP_UP: { label: 'Pós-Atendimento', description: 'Registro de tabulação do chamado' },
  TERMINATED: { label: 'Finalizada', description: 'Chamada encerrada' },
};

export const CALL_DIRECTION_LABELS: Record<CallDirection, string> = {
  INBOUND: 'Recebida (Entrante)',
  OUTBOUND: 'Realizada (Sainte)',
};

export const CALL_END_REASON_LABELS: Record<CallEndReason, string> = {
  AGENT_HANGUP: 'Encerrada pelo Atendente',
  REMOTE_HANGUP: 'Encerrada pelo Cliente',
  REJECTED: 'Recusada pelo Atendente',
  TIMEOUT_MISSED: 'Não Atendida (Perdida)',
  TRANSFERRED: 'Transferida',
  NETWORK_ERROR: 'Queda de Rede / Conexão',
};

export function getCallStateLabel(state: CallState): string {
  return CALL_STATE_LABELS[state]?.label || state;
}

export function getCallDirectionLabel(direction: CallDirection): string {
  return CALL_DIRECTION_LABELS[direction] || direction;
}

export function getCallEndReasonLabel(reason: CallEndReason): string {
  return CALL_END_REASON_LABELS[reason] || reason;
}

export interface IncomingCallEvent {
  callId: string;
  callerNumber: string;
  callerName?: string;
  queueId?: string;
  queueName?: string;
  timestamp: string;
}

export interface CallSession {
  callId: string;
  direction: CallDirection;
  state: CallState;
  remoteNumber: string;
  remoteName?: string;
  startedAt?: Date;
  connectedAt?: Date;
  endedAt?: Date;
  durationSeconds: number;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  notes?: string;
}

/**
 * CDR - Call Detail Record (Registro detalhado de chamada para relatórios e auditoria)
 */
export interface CDRRecord {
  id: string;
  callId: string;
  direction: CallDirection;
  callerNumber: string;
  calleeNumber: string;
  agentId: string;
  agentName: string;
  queueName?: string;
  startedAt: string;
  answeredAt?: string;
  endedAt: string;
  ringDurationSeconds: number;
  talkDurationSeconds: number;
  holdDurationSeconds: number;
  wrapUpDurationSeconds: number;
  endReason: CallEndReason;
  recordingUrl?: string;
  ticketId?: string;
  disposition?: string; // Motivo da tabulação (ex: Suporte, Vendas, Dúvida)
}

/**
 * Gestão de Periféricos de Áudio (ADR-005)
 */
export interface AudioDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export interface AudioSettings {
  microphoneDeviceId: string;
  voiceOutputDeviceId: string;   // Headset USB
  ringerOutputDeviceId: string;  // Caixas de som do computador (Dual-Output)
  microphoneVolume: number;
  voiceVolume: number;
  ringerVolume: number;
}
