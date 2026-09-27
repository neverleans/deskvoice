import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { CrmModule } from './crm/crm.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { TelephonyModule } from './telephony/telephony.module.js';

@Module({
  imports: [CrmModule, TicketsModule, TelephonyModule],
  controllers: [HealthController],
})
export class AppModule {}
