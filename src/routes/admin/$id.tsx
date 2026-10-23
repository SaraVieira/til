import { createFileRoute, useRouter } from '@tanstack/react-router'
import { TilForm } from '#/components/TilForm'
import { getTilById, updateTil } from '#/server/tils.functions'

export const Route = createFileRoute('/admin/$id')({
  loader: ({ params }) => getTilById({ data: { id: Number(params.id) } }),
  component: EditPage,
})

function EditPage() {
  const til = Route.useLoaderData()
  const router = useRouter()

  return (
    <section>
      <h1>Edit</h1>
      <TilForm
        initial={til}
        submitLabel="Save"
        onSubmit={async (input) => {
          const updated = await updateTil({ data: { ...input, id: til.id } })
          await router.invalidate()
          await router.navigate({
            to: '/til/$slug',
            params: { slug: updated.slug },
          })
        }}
      />
    </section>
  )
}
