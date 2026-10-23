import { useState } from 'react'
import type { Til } from '#/db/schema'
import type { TilInput } from '#/server/tils.functions'
import { Markdown } from './Markdown'

type Props = {
  initial?: Pick<Til, 'title' | 'body' | 'tags' | 'source'>
  submitLabel: string
  onSubmit: (input: TilInput) => Promise<void>
}

const empty = { title: '', body: '', tags: [] as string[], source: [''] as string[] }

export function TilForm({ initial = empty, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title)
  const [source, setSource] = useState(initial.source)
  const [body, setBody] = useState(initial.body)
  const [tags, setTags] = useState(initial.tags.join(', '))
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit() {
    setSaving(true)
    setError(null)
    try {
      await onSubmit({ title, body, tags: tags.split(','), source })
      if (initial === empty) {
        setTitle('')
        setBody('')
        setTags('')
        setSource([])
        setPreview(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  function submitOnShortcut(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void submit()
      }}
    >
      <input
        placeholder="What did you learn today?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={submitOnShortcut}
        autoFocus
      />
      <div>
        <button type="button" onClick={() => setPreview(false)}>
          Write
        </button>
        <button type="button" onClick={() => setPreview(true)}>
          Preview
        </button>
      </div>
      {preview ? (
        <div>
          <Markdown source={body || '_Nothing to preview_'} />
        </div>
      ) : (
        <textarea
          placeholder="Write it in markdown…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={submitOnShortcut}
        />
      )}
      <input
        placeholder="tags, comma, separated"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        onKeyDown={submitOnShortcut}
      />
      <input
        placeholder="source"
        value={source[0]}
        onChange={(e) => {
          setSource([e.target.value])
        }}
        onKeyDown={submitOnShortcut}
      />
      <div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
        <span>⌘ + Enter</span>
        {error && <span>{error}</span>}
      </div>
    </form>
  )
}
