import { createFileRoute } from '@tanstack/react-router'
import { TilList } from '#/components/TilList'
import { listTils } from '#/server/tils.functions'

export const Route = createFileRoute('/tags/$tag')({
  loader: ({ params }) => listTils({ data: { tag: params.tag } }),
  head: ({ params }) => ({ meta: [{ title: `#${params.tag} · TIL` }] }),
  component: TagPage,
})

function TagPage() {
  const tils = Route.useLoaderData()
  const { tag } = Route.useParams()

  return (
    <div>
      <h1>#{tag}</h1>
      <TilList tils={tils} />
    </div>
  )
}
