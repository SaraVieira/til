import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const tils = pgTable(
  'tils',
  {
    id: serial().primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    body: text().notNull(),
    tags: text().array().notNull().default([]),
    source: text().array().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('tils_created_at_idx').on(t.createdAt)],
)

export type Til = typeof tils.$inferSelect
