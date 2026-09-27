export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  document?: string; // CPF ou CNPJ
  avatarUrl?: string;
  isVip?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineInteraction {
  id: string;
  customerId: string;
  type: 'CALL' | 'TICKET' | 'NOTE' | 'WHATSAPP';
  title: string;
  description?: string;
  durationSeconds?: number;
  agentName: string;
  createdAt: string;
}
