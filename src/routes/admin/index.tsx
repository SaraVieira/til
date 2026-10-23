import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { TilForm } from '#/components/TilForm'
import { formatDate } from '#/lib/markdown'
import { logout } from '#/server/auth.functions'
import { createTil, deleteTil, listTils } from '#/server/tils.functions'

export const Route = createFileRoute('/admin/')({
  loader: () => listTils({ data: {} }),
  component: AdminPage,
})

function AdminPage() {
  const tils = Route.useLoaderData()
  const router = useRouter()

  return (
    <div>
      <section>
        <div>
          <h1>New TIL</h1>
          <button
            type="button"
            onClick={async () => {
              await logout()
              await router.invalidate()
              await router.navigate({ to: '/' })
            }}
          >
            Log out
          </button>
        </div>
        <TilForm
          submitLabel="Publish"
          onSubmit={async (input) => {
            await createTil({ data: input })
            await router.invalidate()
          }}
        />
      </section>

      <section>
        <h2>All entries ({tils.length})</h2>
        <ul>
          {tils.map((til) => (
            <li key={til.id}>
              <span>{formatDate(til.createdAt)}</span>
              <Link to="/til/$slug" params={{ slug: til.slug }}>
                {til.title}
              </Link>
              <Link to="/admin/$id" params={{ id: String(til.id) }}>
                Edit
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await deleteTil({ data: { id: til.id } })
                  await router.invalidate()
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
