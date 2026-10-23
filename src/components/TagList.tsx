import { Link } from '@tanstack/react-router'

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>
          <Link to="/tags/$tag" params={{ tag }}>
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  )
}
