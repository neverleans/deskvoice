import { Controller, Get, Post, Body } from '@nestjs/common';
import { TelephonyService } from './telephony.service.js';
import { TelephonyGateway } from './telephony.gateway.js';
import type { CDRRecord, CallSession } from '@deskvoice/shared';

@Controller('telephony')
export class TelephonyController {
  constructor(
    private readonly telephonyService: TelephonyService,
    private readonly telephonyGateway: TelephonyGateway,
  ) {}

  @Get('active-calls')
  getActiveCalls(): CallSession[] {
    return this.telephonyService.getActiveCalls();
  }

  @Get('cdrs')
  getCDRs(): CDRRecord[] {
    return this.telephonyService.getCDRs();
  }

  @Post('simulate-incoming')
  simulateIncoming(
    @Body()
    data: {
      callerNumber?: string;
      callerName?: string;
    },
  ): { callId: string; status: string } {
    const callId = `sim-call-${Date.now()}`;
    const callerNumber = data.callerNumber || '31988881234';
    const callerName = data.callerName || 'Roberto Alencar';

    const session: CallSession = {
      callId,
      direction: 'INBOUND',
      state: 'RINGING_IN',
      remoteNumber: callerNumber,
      remoteName: callerName,
      startedAt: new Date(),
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: true,
    };

    this.telephonyService.registerCall(session);

    // Emit incoming call to all connected agents via WebSocket
    this.telephonyGateway.server?.emit('call:incoming', session);

    return { callId, status: 'RINGING_IN' };
  }
}
