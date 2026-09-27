import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { CrmService } from './crm.service.js';
import type { Customer } from '@deskvoice/shared';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('customers')
  getCustomers(): Customer[] {
    return this.crmService.findAll();
  }

  @Get('customers/lookup')
  lookupCustomer(@Query('phone') phone: string): Customer {
    if (!phone) {
      throw new NotFoundException('Número de telefone obrigatório para consulta.');
    }
    const customer = this.crmService.findByPhone(phone);
    if (!customer) {
      throw new NotFoundException(`Nenhum cliente localizado para o telefone: ${phone}`);
    }
    return customer;
  }

  @Post('customers')
  createCustomer(@Body() data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    return this.crmService.create(data);
  }
}
