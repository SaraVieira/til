import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.isAdmin) throw redirect({ to: '/login' })
  },
  head: () => ({ meta: [{ title: 'Admin · TIL' }] }),
  component: Outlet,
})
