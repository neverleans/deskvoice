import { Injectable } from '@nestjs/common';
import type { Customer } from '@deskvoice/shared';

@Injectable()
export class CrmService {
  private customers: Customer[] = [
    {
      id: 'cust-001',
      name: 'Roberto Alencar',
      company: 'Logística Express Brasil',
      phone: '31988881234',
      email: 'roberto@logisticaexpress.com.br',
      document: '12.345.678/0001-90',
      isVip: true,
      notes: 'Cliente Enterprise. Prioridade máxima em suporte operacional.',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2026-09-20T14:30:00Z',
    },
    {
      id: 'cust-002',
      name: 'Mariana Duarte',
      company: 'Finanças Tech Ltda',
      phone: '11977774321',
      email: 'mariana.duarte@financastech.com',
      document: '98.765.432/0001-10',
      isVip: false,
      notes: 'Dúvidas sobre conciliação bancária.',
      createdAt: '2025-06-10T08:00:00Z',
      updatedAt: '2026-09-25T11:15:00Z',
    },
  ];

  findAll(): Customer[] {
    return this.customers;
  }

  findByPhone(phone: string): Customer | null {
    const clean = phone.replace(/\D/g, '');
    return this.customers.find((c) => c.phone.includes(clean) || clean.includes(c.phone)) || null;
  }

  create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.unshift(newCust);
    return newCust;
  }
}
