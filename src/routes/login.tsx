import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '#/server/auth.functions'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.isAdmin) throw redirect({ to: '/admin' })
  },
  head: () => ({ meta: [{ title: 'Login · TIL' }] }),
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        try {
          await login({ data: { password } })
          await router.invalidate()
          await router.navigate({ to: '/admin' })
        } catch {
          setError('Wrong password')
        }
      }}
    >
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button type="submit">Log in</button>
      {error && <p>{error}</p>}
    </form>
  )
}
