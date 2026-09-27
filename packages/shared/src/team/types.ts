export type AgentStatusType = 'AVAILABLE' | 'IN_CALL' | 'PAUSE_LUNCH' | 'PAUSE_TRAINING' | 'OFFLINE';

export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'ADMIN';

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
