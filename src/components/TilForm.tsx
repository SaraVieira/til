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

const field =
  'w-full border-amber-600 border-2 rounded-lg bg-stone-100 p-2 placeholder:text-stone-400 outline-none focus-visible:ring-2 focus-visible:ring-amber-600/30'

function tabClass(active: boolean) {
  return `pb-1 border-b-2 transition-colors ${
    active
      ? 'border-amber-700 text-amber-700'
      : 'border-transparent text-stone-500 hover:text-stone-800'
  }`
}

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
        setSource([''])
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
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        void submit()
      }}
    >
      <input
        placeholder="What did you learn today?"
        value={title}
        className={`${field} text-2xl font-bold`}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={submitOnShortcut}
        autoFocus
      />
      <div>
        <div className="flex items-center gap-4 mb-2 text-sm">
          <button
            type="button"
            aria-pressed={!preview}
            className={tabClass(!preview)}
            onClick={() => setPreview(false)}
          >
            Write
          </button>
          <button
            type="button"
            aria-pressed={preview}
            className={tabClass(preview)}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>
        {preview ? (
          <div className={`${field} min-h-64`}>
            <Markdown source={body || '_Nothing to preview_'} />
          </div>
        ) : (
          <textarea
            placeholder="Write it in markdown…"
            value={body}
            className={`${field} block min-h-64 font-mono text-sm resize-y`}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={submitOnShortcut}
          />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          placeholder="tags, comma, separated"
          value={tags}
          className={field}
          onChange={(e) => setTags(e.target.value)}
          onKeyDown={submitOnShortcut}
        />
        <input
          placeholder="source"
          value={source[0]}
          className={field}
          onChange={(e) => {
            setSource([e.target.value])
          }}
          onKeyDown={submitOnShortcut}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-700 text-stone-100 font-bold rounded-lg px-4 py-2 transition-colors hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        <span className="text-sm text-stone-500">⌘ + Enter</span>
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </form>
  )
}
