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
