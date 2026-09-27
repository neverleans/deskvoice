import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const companyNumbers = pgTable('company_numbers', {
  id: text('id').primaryKey(),
  number: text('number').notNull().unique(), // Ex: '(31) 3333-1111'
  label: text('label').notNull(),
  type: text('type').$type<'LANDLINE' | 'MOBILE' | 'TOLL_FREE' | 'WHATSAPP'>().notNull(),
  channel: text('channel').$type<'VOICE' | 'WHATSAPP' | 'BOTH'>().notNull(),
  assignedQueue: text('assigned_queue').notNull(),
  status: text('status').$type<'ACTIVE' | 'INACTIVE'>().default('ACTIVE').notNull(),
  provider: text('provider').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CompanyNumberEntity = typeof companyNumbers.$inferSelect;
export type NewCompanyNumberEntity = typeof companyNumbers.$inferInsert;
