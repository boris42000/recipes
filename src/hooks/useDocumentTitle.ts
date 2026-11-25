import { useEffect } from 'react'
import { s } from '../strings'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? s.pageTitle(title) : s.appName
  }, [title])
}
