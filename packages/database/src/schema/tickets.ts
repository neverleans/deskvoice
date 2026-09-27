import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customers } from './customers.js';
import { users } from './users.js';

export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  protocol: text('protocol').notNull().unique(), // Ex: 'DV-20260927-1042'
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  customerName: text('customer_name').notNull(),
  agentId: text('agent_id').references(() => users.id, { onDelete: 'set null' }),
  agentName: text('agent_name').notNull(),
  status: text('status')
    .$type<'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED'>()
    .default('OPEN')
    .notNull(),
  priority: text('priority')
    .$type<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>()
    .default('MEDIUM')
    .notNull(),
  category: text('category').notNull(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  callId: text('call_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

export type TicketEntity = typeof tickets.$inferSelect;
export type NewTicketEntity = typeof tickets.$inferInsert;
