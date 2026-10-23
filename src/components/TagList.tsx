import { Link } from '@tanstack/react-router'

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <ul className="flex items-center gap-2">
      {tags.map((tag) => (
        <li key={tag} className="text-sm text-amber-700">
          <Link to="/tags/$tag" params={{ tag }}>
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  )
}
