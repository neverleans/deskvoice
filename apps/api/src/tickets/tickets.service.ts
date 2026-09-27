import { Injectable, NotFoundException } from '@nestjs/common';
import type { Ticket, TicketStatus, TicketPriority } from '@deskvoice/shared';

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [
    {
      id: 'tick-001',
      protocol: 'DV-20260927-1042',
      customerId: 'cust-001',
      customerName: 'Roberto Alencar',
      agentId: 'agt-001',
      agentName: 'Lucas Silva',
      status: 'OPEN',
      priority: 'HIGH',
      subject: 'Falha intermitente na emissão de NF-e via API',
      description: 'Cliente reporta erro 504 Gateway Timeout ao enviar lote de notas após as 11h.',
      category: 'Suporte Técnico',
      createdAt: '2026-09-27T10:42:00Z',
      updatedAt: '2026-09-27T10:45:00Z',
    },
    {
      id: 'tick-002',
      protocol: 'DV-20260926-0915',
      customerId: 'cust-002',
      customerName: 'Mariana Duarte',
      agentId: 'agt-002',
      agentName: 'Ana Beatriz',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      subject: 'Dúvida sobre relatório consolidado mensal',
      description: 'Cliente instruída sobre exportação de CSV no módulo de relatórios.',
      category: 'Financeiro',
      createdAt: '2026-09-26T09:15:00Z',
      updatedAt: '2026-09-26T09:40:00Z',
      resolvedAt: '2026-09-26T09:40:00Z',
    },
  ];

  findAll(filters?: { status?: string; priority?: string }): Ticket[] {
    let result = [...this.tickets];
    if (filters?.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters?.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }
    return result;
  }

  findById(id: string): Ticket {
    const ticket = this.tickets.find((t) => t.id === id || t.protocol === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket com identificador ${id} não encontrado.`);
    }
    return ticket;
  }

  create(data: {
    customerId: string;
    customerName: string;
    agentId: string;
    agentName: string;
    priority?: TicketPriority;
    subject: string;
    description: string;
    category: string;
    callId?: string;
  }): Ticket {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocol = `DV-${dateStr}-${randomSuffix}`;

    const newTicket: Ticket = {
      id: `tick-${Date.now()}`,
      protocol,
      customerId: data.customerId,
      customerName: data.customerName,
      agentId: data.agentId,
      agentName: data.agentName,
      status: 'OPEN',
      priority: data.priority ?? 'MEDIUM',
      subject: data.subject,
      description: data.description,
      category: data.category,
      callId: data.callId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  updateStatus(id: string, status: TicketStatus): Ticket {
    const ticket = this.findById(id);
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    if (status === 'RESOLVED' || status === 'CLOSED') {
      ticket.resolvedAt = new Date().toISOString();
    }
    return ticket;
  }
}
