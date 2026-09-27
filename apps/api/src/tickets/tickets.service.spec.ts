import { describe, it, expect, beforeEach } from 'vitest';
import { TicketsService } from './tickets.service.js';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(() => {
    service = new TicketsService();
  });

  it('deve listar todos os tickets cadastrados', () => {
    const tickets = service.findAll();
    expect(tickets.length).toBeGreaterThanOrEqual(2);
  });

  it('deve filtrar tickets por status', () => {
    const openTickets = service.findAll({ status: 'OPEN' });
    expect(openTickets.every((t) => t.status === 'OPEN')).toBe(true);
  });

  it('deve criar um novo ticket gerando protocolo determinístico', () => {
    const ticket = service.create({
      customerId: 'cust-001',
      customerName: 'Roberto Alencar',
      agentId: 'agt-001',
      agentName: 'Lucas Silva',
      priority: 'HIGH',
      subject: 'Problema na fila de espera',
      description: 'Tempo de espera excedeu SLA contratual de 30 segundos.',
      category: 'Telefonia',
    });

    expect(ticket.id).toBeDefined();
    expect(ticket.protocol).toMatch(/^DV-\d{8}-\d{4}$/);
    expect(ticket.status).toBe('OPEN');
  });

  it('deve atualizar o status de um ticket', () => {
    const updated = service.updateStatus('tick-001', 'RESOLVED');
    expect(updated.status).toBe('RESOLVED');
    expect(updated.resolvedAt).toBeDefined();
  });
});
