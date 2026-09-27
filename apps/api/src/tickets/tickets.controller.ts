import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import type { Ticket, TicketStatus, TicketPriority } from '@deskvoice/shared';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  getTickets(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ): Ticket[] {
    return this.ticketsService.findAll({ status, priority });
  }

  @Get(':id')
  getTicket(@Param('id') id: string): Ticket {
    return this.ticketsService.findById(id);
  }

  @Post()
  createTicket(
    @Body()
    data: {
      customerId: string;
      customerName: string;
      agentId: string;
      agentName: string;
      priority?: TicketPriority;
      subject: string;
      description: string;
      category: string;
      callId?: string;
    },
  ): Ticket {
    return this.ticketsService.create(data);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
  ): Ticket {
    return this.ticketsService.updateStatus(id, status);
  }
}
