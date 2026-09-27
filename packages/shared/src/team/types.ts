export type AgentStatusType = 'AVAILABLE' | 'IN_CALL' | 'PAUSE_LUNCH' | 'PAUSE_TRAINING' | 'OFFLINE';

export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'ADMIN';

export const AGENT_STATUS_LABELS: Record<AgentStatusType, string> = {
  AVAILABLE: 'Disponível',
  IN_CALL: 'Em Chamada',
  PAUSE_LUNCH: 'Pausa Almoço',
  PAUSE_TRAINING: 'Em Treinamento',
  OFFLINE: 'Desconectado / Offline',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  OPERATOR: 'Atendente',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrador',
};

export function getAgentStatusLabel(status: AgentStatusType): string {
  return AGENT_STATUS_LABELS[status] ?? status;
}

export function getUserRoleLabel(role: UserRole): string {
  return USER_ROLE_LABELS[role] ?? role;
}

export interface AgentInfo {
  id: string;
  name: string;
  email: string;
  extension: string; // Ex: Ramal 101
  department: string;
  role: UserRole;
  status: AgentStatusType;
  statusSince: string;
  callsHandledToday: number;
  averageTalkTimeSeconds: number;
  csatScore: number; // Ex: 4.8 de 5.0
  avatarUrl?: string;
}

export interface CompanyNumber {
  id: string;
  number: string; // Ex: (31) 3333-1111
  label: string; // Ex: Atendimento Comercial
  type: 'LANDLINE' | 'MOBILE' | 'TOLL_FREE' | 'WHATSAPP';
  channel: 'VOICE' | 'WHATSAPP' | 'BOTH';
  assignedQueue: string;
  status: 'ACTIVE' | 'INACTIVE';
  provider: string; // Ex: Tronco SIP Alpha / Meta Cloud API
}
