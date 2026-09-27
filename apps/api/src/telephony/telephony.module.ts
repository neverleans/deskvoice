import { Module } from '@nestjs/common';
import { TelephonyController } from './telephony.controller.js';
import { TelephonyService } from './telephony.service.js';
import { TelephonyGateway } from './telephony.gateway.js';

@Module({
  controllers: [TelephonyController],
  providers: [TelephonyService, TelephonyGateway],
  exports: [TelephonyService, TelephonyGateway],
})
export class TelephonyModule {}
