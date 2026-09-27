import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').$type<'OPERATOR' | 'SUPERVISOR' | 'ADMIN'>().default('OPERATOR').notNull(),
  extension: text('extension').notNull().unique(), // Ex: '101'
  department: text('department').notNull().default('Suporte N1'),
  status: text('status').$type<'AVAILABLE' | 'IN_CALL' | 'PAUSE_LUNCH' | 'PAUSE_TRAINING' | 'OFFLINE'>().default('AVAILABLE').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;
