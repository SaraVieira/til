import { Link, createFileRoute } from '@tanstack/react-router'
import { Markdown } from '#/components/Markdown'
import { TagList } from '#/components/TagList'
import { formatDate } from '#/lib/markdown'
import { getTil } from '#/server/tils.functions'

export const Route = createFileRoute('/til/$slug')({
  loader: ({ params }) => getTil({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} · TIL` : 'TIL' }],
  }),
  component: TilPage,
})

function TilPage() {
  const til = Route.useLoaderData()
  const { isAdmin } = Route.useRouteContext()

  return (
    <article>
      <header>
        <time>{formatDate(til.createdAt)}</time>
        <h1>{til.title}</h1>
        <TagList tags={til.tags} />
      </header>
      <Markdown source={til.body} />
      {isAdmin && (
        <Link to="/admin/$id" params={{ id: String(til.id) }}>
          Edit
        </Link>
      )}
    </article>
  )
}
