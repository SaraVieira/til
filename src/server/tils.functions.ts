import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { and, arrayContains, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '#/db'
import { tils } from '#/db/schema'
import { assertAdmin } from './session'

export type TilInput = {
  title: string
  body: string
  tags: string[]
  source: string[]
  createdAt: string
}

type ParsedTilInput = Omit<TilInput, 'createdAt'> & { createdAt: Date }

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parseInput(data: TilInput): ParsedTilInput {
  const title = data.title.trim()
  const body = data.body.trim()
  if (!title) throw new Error('Title is required')
  if (!body) throw new Error('Body is required')
  const createdAt = new Date(data.createdAt)
  if (Number.isNaN(createdAt.getTime())) throw new Error('Date is invalid')
  const tags = [...new Set(data.tags.map((tag) => slugify(tag)).filter(Boolean))]
  return { title, body, tags, source: data.source, createdAt }
}

async function uniqueSlug(title: string, ignoreId?: number) {
  const base = slugify(title) || 'til'
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`
    const [existing] = await db.select({ id: tils.id }).from(tils).where(eq(tils.slug, slug))
    if (!existing || existing.id === ignoreId) return slug
  }
}

export const listTils = createServerFn({ method: 'GET' })
  .validator((data: { q?: string; tag?: string }) => data)
  .handler(async ({ data }) => {
    const filters = []
    if (data.tag) filters.push(arrayContains(tils.tags, [data.tag]))
    if (data.q) {
      const pattern = `%${data.q}%`
      filters.push(or(ilike(tils.title, pattern), ilike(tils.body, pattern)))
    }
    return db
      .select()
      .from(tils)
      .where(and(...filters))
      .orderBy(desc(tils.createdAt))
  })

export const listTags = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.execute<{ tag: string; count: number }>(
    sql`select tag, count(*)::int as count from ${tils}, unnest(${tils.tags}) as tag group by tag order by count desc, tag`,
  )
  return rows.rows
})

export const getTil = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const [til] = await db.select().from(tils).where(eq(tils.slug, data.slug))
    if (!til) throw notFound()
    return til
  })

export const getTilById = createServerFn({ method: 'GET' })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin()
    const [til] = await db.select().from(tils).where(eq(tils.id, data.id))
    if (!til) throw notFound()
    return til
  })

export const createTil = createServerFn({ method: 'POST' })
  .validator(parseInput)
  .handler(async ({ data }) => {
    assertAdmin()
    const slug = await uniqueSlug(data.title)
    const [til] = await db
      .insert(tils)
      .values({ ...data, slug })
      .returning()
    return til
  })

export const updateTil = createServerFn({ method: 'POST' })
  .validator((data: TilInput & { id: number }) => ({
    id: data.id,
    ...parseInput(data),
  }))
  .handler(async ({ data: { id, ...input } }) => {
    assertAdmin()
    const slug = await uniqueSlug(input.title, id)
    const [til] = await db
      .update(tils)
      .set({ ...input, slug, updatedAt: new Date() })
      .where(eq(tils.id, id))
      .returning()
    return til
  })

export const deleteTil = createServerFn({ method: 'POST' })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    assertAdmin()
    await db.delete(tils).where(eq(tils.id, data.id))
  })
