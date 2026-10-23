import { Link, createFileRoute } from '@tanstack/react-router'
import { getTil } from '#/server/tils.functions'
import { TIL } from '#/components/TilList'

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
      <TIL til={til} full />
      {isAdmin && (
        <Link to="/admin/$id" params={{ id: String(til.id) }}>
          Edit
        </Link>
      )}
    </article>
  )
}
