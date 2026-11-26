import { Link, Outlet, ScrollRestoration } from 'react-router'
import { s } from '../strings'
import { CategoryIcon } from './CategoryIcon'

export function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          <CategoryIcon size={30} />
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
