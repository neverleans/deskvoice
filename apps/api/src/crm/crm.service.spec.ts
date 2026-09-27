import { describe, it, expect, beforeEach } from 'vitest';
import { CrmService } from './crm.service.js';

describe('CrmService', () => {
  let service: CrmService;

  beforeEach(() => {
    service = new CrmService();
  });

  it('deve listar todos os clientes cadastrados', () => {
    const customers = service.findAll();
    expect(customers.length).toBeGreaterThanOrEqual(2);
    expect(customers[0].name).toBe('Roberto Alencar');
  });

  it('deve localizar cliente por número de telefone (com formatação flexível)', () => {
    const customer = service.findByPhone('31988881234');
    expect(customer).toBeDefined();
    expect(customer?.name).toBe('Roberto Alencar');
    expect(customer?.isVip).toBe(true);

    const formattedCustomer = service.findByPhone('(31) 98888-1234');
    expect(formattedCustomer?.id).toBe(customer?.id);
  });

  it('deve cadastrar um novo cliente no CRM', () => {
    const newCust = service.create({
      name: 'Carlos Mendes',
      phone: '11999887766',
      email: 'carlos@mendes.com.br',
      company: 'Mendes Transportes',
      isVip: false,
    });

    expect(newCust.id).toBeDefined();
    expect(service.findAll()).toContainEqual(newCust);
  });
});
