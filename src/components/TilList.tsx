import { Link } from '@tanstack/react-router'
import type { Til } from '#/db/schema'
import { excerpt, formatDate } from '#/lib/markdown'
import { TagList } from './TagList'

export function TilList({ tils }: { tils: Til[] }) {
  if (!tils.length) {
    return <p>Nothing here yet.</p>
  }
  console.log(tils)
  return (
    <ol>
      {tils.map((til) => (
        <li key={til.id}>
          <time>{formatDate(til.createdAt)}</time>
          <h2>
            <Link to="/til/$slug" params={{ slug: til.slug }}>
              {til.title}
            </Link>
          </h2>
          <p>{excerpt(til.body)}</p>
          <TagList tags={til.tags} />
          {til.source ? (
            <>
Source: {" "}
              {til.source.map(s => <Link key={s} to={s} target='_blank' >
                {s}
              </Link>)}
            </>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
