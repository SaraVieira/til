import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { TilList } from '#/components/TilList'
import { listTils } from '#/server/tils.functions'

type Search = { q?: string }

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ deps }) => listTils({ data: { q: deps.q } }),
  component: Home,
})

function Home() {
  const tils = Route.useLoaderData()
  const { q } = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const [query, setQuery] = useState(q ?? '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      void navigate({
        search: { q: query.trim() || undefined },
        replace: true,
      })
    }, 250)
    return () => clearTimeout(timeout)
  }, [query, navigate])

  return (
<>
      <input
        type="search"
        placeholder="Search what I've learned…"
        value={query}
        className='mb-8 w-full border-amber-600 border-2 rounded-lg bg-stone-100 p-2'
        onChange={(e) => setQuery(e.target.value)}
      />
      <TilList tils={tils} />
    </>
  )
}
