import { createFileRoute } from '@tanstack/react-router'
import { desc } from 'drizzle-orm'
import { db } from '#/db'
import { tils } from '#/db/schema'
import { renderMarkdown } from '#/lib/markdown'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const site = process.env.SITE_URL ?? new URL(request.url).origin
        const rows = await db.select().from(tils).orderBy(desc(tils.createdAt)).limit(50)

        const items = rows
          .map(
            (til) => `
    <item>
      <title>${escapeXml(til.title)}</title>
      <link>${site}/til/${til.slug}</link>
      <guid>${site}/til/${til.slug}</guid>
      <pubDate>${til.createdAt.toUTCString()}</pubDate>
      ${til.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
      <description>${escapeXml(renderMarkdown(til.body))}</description>
    </item>`,
          )
          .join('')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Today I Learned</title>
    <link>${site}</link>
    <description>Things I learned, one day at a time.</description>${items}
  </channel>
</rss>`

        return new Response(xml, {
          headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
        })
      },
    },
  },
})
