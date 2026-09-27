import { describe, expect, it } from 'vitest';
import { CallStateMachine } from './state-machine.js';
import type { IncomingCallEvent } from './types.js';

describe('CallStateMachine (ADR-004)', () => {
  it('deve inicializar em estado IDLE', () => {
    const fsm = new CallStateMachine();
    expect(fsm.state).toBe('IDLE');
    expect(fsm.session).toBeNull();
  });

  it('deve receber chamada entrante e transitar para RINGING_IN', () => {
    const fsm = new CallStateMachine();
    const event: IncomingCallEvent = {
      callId: 'call-101',
      callerNumber: '31999998888',
      callerName: 'Cliente Teste',
      timestamp: new Date().toISOString(),
    };

    fsm.ringIncoming(event);

    expect(fsm.state).toBe('RINGING_IN');
    expect(fsm.session?.remoteNumber).toBe('31999998888');
    expect(fsm.session?.remoteName).toBe('Cliente Teste');
  });

  it('deve permitir atender a chamada e transitar para CONNECTED', () => {
    const fsm = new CallStateMachine();
    fsm.ringIncoming({
      callId: 'call-102',
      callerNumber: '31988887777',
      timestamp: new Date().toISOString(),
    });

    fsm.answer();

    expect(fsm.state).toBe('CONNECTED');
    expect(fsm.session?.connectedAt).toBeInstanceOf(Date);
  });

  it('deve colocar em espera (ON_HOLD) e retomar para CONNECTED', () => {
    const fsm = new CallStateMachine();
    fsm.ringIncoming({ callId: 'call-103', callerNumber: '31977776666', timestamp: new Date().toISOString() });
    fsm.answer();

    fsm.hold();
    expect(fsm.state).toBe('ON_HOLD');
    expect(fsm.session?.isOnHold).toBe(true);

    fsm.resume();
    expect(fsm.state).toBe('CONNECTED');
    expect(fsm.session?.isOnHold).toBe(false);
  });

  it('deve alternar mudo do microfone', () => {
    const fsm = new CallStateMachine();
    fsm.ringIncoming({ callId: 'call-104', callerNumber: '31966665555', timestamp: new Date().toISOString() });
    fsm.answer();

    expect(fsm.session?.isMuted).toBe(false);
    expect(fsm.toggleMute()).toBe(true);
    expect(fsm.session?.isMuted).toBe(true);
    expect(fsm.toggleMute()).toBe(false);
    expect(fsm.session?.isMuted).toBe(false);
  });

  it('deve transitar para WRAP_UP ao desligar chamada conectada', () => {
    const fsm = new CallStateMachine();
    fsm.ringIncoming({ callId: 'call-105', callerNumber: '31955554444', timestamp: new Date().toISOString() });
    fsm.answer();

    fsm.hangup('AGENT_HANGUP');
    expect(fsm.state).toBe('WRAP_UP');
    expect(fsm.session?.endedAt).toBeInstanceOf(Date);

    // Conclui tabulação e retorna ao repouso
    fsm.completeWrapUp('Cliente com dúvida no faturamento resolvida.');
    expect(fsm.state).toBe('IDLE');
    expect(fsm.session).toBeNull();
  });

  it('deve lançar erro se tentar transição ilegal', () => {
    const fsm = new CallStateMachine();
    // Tentar atender sem chamada tocando
    expect(() => fsm.answer()).toThrowError(/Não é possível atender/);
    // Tentar colocar em espera sem chamada
    expect(() => fsm.hold()).toThrowError(/Apenas chamadas conectadas/);
  });
});
