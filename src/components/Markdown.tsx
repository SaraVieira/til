import { renderMarkdown } from '#/lib/markdown'

export function Markdown({ source }: { source: string }) {
  return (
    <div
      className="prose prose-stone max-w-none prose-a:text-amber-700"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }}
    />
  )
}
