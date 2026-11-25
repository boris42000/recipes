import { Link, Outlet, ScrollRestoration } from 'react-router'
import { s } from '../strings'

export function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          {s.appName}
        </Link>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
