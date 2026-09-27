import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const customers = pgTable(
  'customers',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    company: text('company'),
    phone: text('phone').notNull(), // Chave principal de busca no Screen-Pop
    email: text('email'),
    document: text('document'), // CPF ou CNPJ
    avatarUrl: text('avatar_url'),
    isVip: boolean('is_vip').default(false).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_customers_phone').on(table.phone),
  ]
);

export type CustomerEntity = typeof customers.$inferSelect;
export type NewCustomerEntity = typeof customers.$inferInsert;
