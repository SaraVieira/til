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
    <div>
      <header>
        <Link to="/">
          TIL<span>.</span>
        </Link>
        <nav>
          <Link to="/tags">Tags</Link>
          <a href="/rss.xml">RSS</a>
        </nav>
      </header>
      <main>
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
      <body>
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
