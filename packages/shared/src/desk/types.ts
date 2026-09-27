export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em Andamento',
  WAITING_CUSTOMER: 'Aguardando Cliente',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

export function getTicketStatusLabel(status: TicketStatus): string {
  return TICKET_STATUS_LABELS[status] ?? status;
}

export function getTicketPriorityLabel(priority: TicketPriority): string {
  return TICKET_PRIORITY_LABELS[priority] ?? priority;
}

export interface Ticket {
  id: string;
  protocol: string; // Ex: DV-20260927-1042
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  description: string;
  category: string; // Ex: Suporte Técnico, Comercial, Cobrança
  callId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface WrapUpData {
  callId: string;
  customerId?: string;
  category: string;
  notes: string;
  createTicket: boolean;
  ticketPriority?: TicketPriority;
  ticketSubject?: string;
}
