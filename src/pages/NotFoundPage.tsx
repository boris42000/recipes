import { Link } from 'react-router'
import { s } from '../strings'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle(s.notFoundTitle)
  return (
    <div className="message">
      <h1>{s.notFoundTitle}</h1>
      <p>{s.notFoundText}</p>
      <Link to="/">{s.backToList}</Link>
    </div>
  )
}

export function ErrorPage() {
  return (
    <main className="site-main message">
      <h1>{s.errorTitle}</h1>
      <p>{s.errorText}</p>
      <a href={import.meta.env.BASE_URL}>{s.backToList}</a>
    </main>
  )
}
