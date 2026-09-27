import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const cdrs = pgTable(
  'cdrs',
  {
    id: text('id').primaryKey(),
    callId: text('call_id').notNull(),
    direction: text('direction').$type<'INBOUND' | 'OUTBOUND'>().notNull(),
    callerNumber: text('caller_number').notNull(),
    calleeNumber: text('callee_number').notNull(),
    agentId: text('agent_id'),
    agentName: text('agent_name').notNull(),
    queueName: text('queue_name'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    answeredAt: timestamp('answered_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }).notNull(),
    ringDurationSeconds: integer('ring_duration_seconds').default(0).notNull(),
    talkDurationSeconds: integer('talk_duration_seconds').default(0).notNull(),
    holdDurationSeconds: integer('hold_duration_seconds').default(0).notNull(),
    wrapUpDurationSeconds: integer('wrap_up_duration_seconds').default(0).notNull(),
    endReason: text('end_reason').notNull(),
    disposition: text('disposition'), // Motivo da tabulação
    recordingUrl: text('recording_url'),
    ticketId: text('ticket_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_cdrs_caller').on(table.callerNumber),
    index('idx_cdrs_agent').on(table.agentId),
    index('idx_cdrs_started').on(table.startedAt),
  ]
);

export type CDREntity = typeof cdrs.$inferSelect;
export type NewCDREntity = typeof cdrs.$inferInsert;
