import { Link, createFileRoute } from '@tanstack/react-router'
import { listTags } from '#/server/tils.functions'

export const Route = createFileRoute('/tags/')({
  loader: () => listTags(),
  head: () => ({ meta: [{ title: 'Tags · TIL' }] }),
  component: TagsPage,
})

function TagsPage() {
  const tags = Route.useLoaderData()

  return (
    <div>
      <h1 className='text-2xl font-bold mb-8'>Tags</h1>
      {tags.length ? (
        <ul>
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link to="/tags/$tag" params={{ tag }}>
                <span className="text-amber-700">#{tag}</span> <span className='pl-12'>{count} tidbit{ tags.length > 1 ? "s": ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags yet.</p>
      )}
    </div>
  )
}
