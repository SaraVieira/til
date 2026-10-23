import { renderMarkdown } from '#/lib/markdown'

export function Markdown({ source }: { source: string }) {
  return <div dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />
}
