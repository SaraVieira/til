import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { getIsAdmin } from '#/server/auth.functions'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async () => ({ isAdmin: await getIsAdmin() }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Today I Learned' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Today I Learned',
        href: '/rss.xml',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: () => <p>Page not found.</p>,
})

function RootLayout() {
  return (
    <div className="mt-12 max-w-[80%] w-2xl mx-auto">
      <header className="mb-8 mx-auto font-sans flex items-center justify-between">
        <Link to="/" className="title text-2xl font-bold">
          <span className="text-amber-700 group w-full flex transition-all">
            T<span className="group-hover:block hidden text-stone-800">oday</span>
            <span className="group-hover:block hidden text-stone-800">&nbsp;</span>I
            <span className="group-hover:block hidden text-stone-800">&nbsp;</span>L
            <span className="group-hover:block hidden text-stone-800">earned</span>
            <span>.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/why">Why</Link>
          <Link to="/tags">Tags</Link>
          <a href="/rss.xml">RSS</a>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans bg-[#eaeaea] min-h-screen text-[#111]">
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
