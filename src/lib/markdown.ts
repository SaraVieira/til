import { marked } from 'marked'

export function renderMarkdown(source: string) {
  return marked.parse(source, { async: false, gfm: true })
}

export function excerpt(source: string, length = 180) {
  const plain = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]()!-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > length ? `${plain.slice(0, length)}…` : plain
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
