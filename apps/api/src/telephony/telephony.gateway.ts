import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TelephonyService } from './telephony.service.js';
import type { AgentStatusType, CallEndReason, CallSession } from '@deskvoice/shared';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TelephonyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedAgents: Map<string, { socketId: string; agentId: string; status: AgentStatusType }> = new Map();

  constructor(private readonly telephonyService: TelephonyService) {}

  handleConnection(client: Socket) {
    // Client connected to telephony gateway
  }

  handleDisconnect(client: Socket) {
    for (const [agentId, info] of this.connectedAgents.entries()) {
      if (info.socketId === client.id) {
        this.connectedAgents.delete(agentId);
        this.server.emit('agent:presence_changed', {
          agentId,
          status: 'OFFLINE',
          timestamp: new Date().toISOString(),
        });
        break;
      }
    }
  }

  @SubscribeMessage('agent:register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { agentId: string; status?: AgentStatusType },
  ) {
    const status = data.status || 'AVAILABLE';
    this.connectedAgents.set(data.agentId, {
      socketId: client.id,
      agentId: data.agentId,
      status,
    });

    // Notify supervisors of agent registration
    this.server.emit('agent:presence_changed', {
      agentId: data.agentId,
      status,
      timestamp: new Date().toISOString(),
    });

    return { status: 'registered', agentId: data.agentId, currentStatus: status };
  }

  @SubscribeMessage('agent:status_change')
  handleStatusChange(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { agentId: string; status: AgentStatusType },
  ) {
    const agent = this.connectedAgents.get(data.agentId);
    if (agent) {
      agent.status = data.status;
    }

    this.server.emit('agent:presence_changed', {
      agentId: data.agentId,
      status: data.status,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  @SubscribeMessage('call:start')
  handleCallStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      callId: string;
      direction: 'INBOUND' | 'OUTBOUND';
      remoteNumber: string;
      remoteName?: string;
    },
  ) {
    const session: CallSession = {
      callId: data.callId,
      direction: data.direction,
      state: data.direction === 'INBOUND' ? 'RINGING_IN' : 'RINGING_OUT',
      remoteNumber: data.remoteNumber,
      remoteName: data.remoteName,
      startedAt: new Date(),
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: true,
    };

    this.telephonyService.registerCall(session);

    // Broadcast call status to caller and supervisors
    this.server.emit('call:updated', session);
    return { success: true, session };
  }

  @SubscribeMessage('call:answer')
  handleCallAnswer(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    const session = this.telephonyService.updateCall(data.callId, {
      state: 'CONNECTED',
      connectedAt: new Date(),
    });

    if (session) {
      this.server.emit('call:updated', session);
    }

    return { success: !!session, session };
  }

  @SubscribeMessage('call:hangup')
  handleCallHangup(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { callId: string; reason?: CallEndReason },
  ) {
    const reason = data.reason || 'AGENT_HANGUP';
    const cdr = this.telephonyService.endCall(data.callId, reason);

    this.server.emit('call:ended', {
      callId: data.callId,
      endReason: reason,
      cdr,
    });

    return { success: true, cdr };
  }

  @SubscribeMessage('supervisor:command')
  handleSupervisorCommand(
    @ConnectedSocket() _client: Socket,
    @MessageBody()
    data: {
      supervisorId: string;
      callId: string;
      action: 'LISTEN' | 'WHISPER' | 'BARGE';
    },
  ) {
    // Notify room of supervisor intervention
    this.server.emit('supervisor:action_applied', {
      ...data,
      appliedAt: new Date().toISOString(),
    });

    return { success: true, action: data.action };
  }
}
