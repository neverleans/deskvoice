import { Injectable } from '@nestjs/common';
import type { CDRRecord, CallSession, CallEndReason } from '@deskvoice/shared';

@Injectable()
export class TelephonyService {
  private activeCalls: Map<string, CallSession> = new Map();
  private cdrs: CDRRecord[] = [
    {
      id: 'cdr-001',
      callId: 'call-hist-001',
      direction: 'INBOUND',
      callerNumber: '31988881234',
      calleeNumber: '08007770001',
      agentId: 'agt-001',
      agentName: 'Lucas Silva',
      queueName: 'Suporte N2',
      startedAt: '2026-09-27T09:12:00Z',
      answeredAt: '2026-09-27T09:12:08Z',
      endedAt: '2026-09-27T09:18:24Z',
      ringDurationSeconds: 8,
      talkDurationSeconds: 376,
      holdDurationSeconds: 30,
      wrapUpDurationSeconds: 45,
      endReason: 'AGENT_HANGUP',
      recordingUrl: 'https://storage.deskvoice.internal/rec/call-hist-001.opus',
      ticketId: 'tick-001',
      disposition: 'Suporte Técnico Resolvido',
    },
    {
      id: 'cdr-002',
      callId: 'call-hist-002',
      direction: 'OUTBOUND',
      callerNumber: '1133334444',
      calleeNumber: '11977774321',
      agentId: 'agt-002',
      agentName: 'Ana Beatriz',
      queueName: 'Comercial SDR',
      startedAt: '2026-09-27T10:04:10Z',
      answeredAt: '2026-09-27T10:04:22Z',
      endedAt: '2026-09-27T10:09:50Z',
      ringDurationSeconds: 12,
      talkDurationSeconds: 328,
      holdDurationSeconds: 0,
      wrapUpDurationSeconds: 30,
      endReason: 'REMOTE_HANGUP',
      recordingUrl: 'https://storage.deskvoice.internal/rec/call-hist-002.opus',
      disposition: 'Proposta Comercial Apresentada',
    },
    {
      id: 'cdr-003',
      callId: 'call-hist-003',
      direction: 'INBOUND',
      callerNumber: '21999990000',
      calleeNumber: '08007770001',
      agentId: 'agt-001',
      agentName: 'Lucas Silva',
      queueName: 'Geral',
      startedAt: '2026-09-27T11:30:00Z',
      endedAt: '2026-09-27T11:30:25Z',
      ringDurationSeconds: 25,
      talkDurationSeconds: 0,
      holdDurationSeconds: 0,
      wrapUpDurationSeconds: 0,
      endReason: 'TIMEOUT_MISSED',
      disposition: 'Chamada Não Atendida / Abandonada',
    },
  ];

  getActiveCalls(): CallSession[] {
    return Array.from(this.activeCalls.values());
  }

  getActiveCall(callId: string): CallSession | undefined {
    return this.activeCalls.get(callId);
  }

  registerCall(session: CallSession): void {
    this.activeCalls.set(session.callId, session);
  }

  updateCall(callId: string, updates: Partial<CallSession>): CallSession | null {
    const call = this.activeCalls.get(callId);
    if (!call) return null;
    const updated = { ...call, ...updates };
    this.activeCalls.set(callId, updated);
    return updated;
  }

  endCall(callId: string, reason: CallEndReason, wrapUpDurationSeconds = 0): CDRRecord | null {
    const call = this.activeCalls.get(callId);
    if (!call) return null;

    const endedAt = new Date().toISOString();
    const cdr: CDRRecord = {
      id: `cdr-${Date.now()}`,
      callId: call.callId,
      direction: call.direction,
      callerNumber: call.direction === 'INBOUND' ? call.remoteNumber : '08007770001',
      calleeNumber: call.direction === 'OUTBOUND' ? call.remoteNumber : '08007770001',
      agentId: 'agt-001',
      agentName: 'Lucas Silva',
      queueName: 'Fila Principal',
      startedAt: call.startedAt ? call.startedAt.toISOString() : endedAt,
      answeredAt: call.connectedAt ? call.connectedAt.toISOString() : undefined,
      endedAt,
      ringDurationSeconds: 5,
      talkDurationSeconds: call.durationSeconds,
      holdDurationSeconds: 0,
      wrapUpDurationSeconds,
      endReason: reason,
      disposition: 'Atendimento Concluído',
    };

    this.activeCalls.delete(callId);
    this.cdrs.unshift(cdr);
    return cdr;
  }

  getCDRs(): CDRRecord[] {
    return this.cdrs;
  }
}
