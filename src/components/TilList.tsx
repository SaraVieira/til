import { Link } from '@tanstack/react-router'
import type { Til } from '#/db/schema'
import { excerpt, formatDate } from '#/lib/markdown'
import { Markdown } from './Markdown'
import { TagList } from './TagList'

export function TilList({ tils }: { tils: Til[] }) {
  if (!tils.length) {
    return <p>Nothing here yet.</p>
  }
  return (
    <ol>
      {tils.map((til) => (
        <li key={til.id}>
          <TIL til={til} />
        </li>
      ))}
    </ol>
  )
}

export const TIL = ({ til, full = false }: { til: Til; full?: boolean }) => {
  return (
    <>
      <div className="flex items-center gap-8 mb-2 text-sm">
        <time className="text-stone-500">{formatDate(til.createdAt)}</time>
        <TagList tags={til.tags} />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        <Link to="/til/$slug" params={{ slug: til.slug }}>
          {til.title}
        </Link>
      </h2>
      {full ? <Markdown source={til.body} /> : <p className="text-base">{excerpt(til.body)}</p>}

      {til.source ? (
        <div className="text-sm text-stone-500 mt-2">
          Source:{' '}
          {til.source.map((s) => (
            <Link className="text-lime-600 hover:underline" key={s} to={s} target="_blank">
              {s}
            </Link>
          ))}
        </div>
      ) : null}
    </>
  )
}
