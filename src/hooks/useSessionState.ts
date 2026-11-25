import { useEffect, useState } from 'react'

/**
 * useState that survives a reload of the tab (e.g. the phone killing the browser mid-cooking),
 * but resets in a new session.
 */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key)
      return stored === null ? initial : (JSON.parse(stored) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or disabled: state just won't persist
    }
  }, [key, value])

  return [value, setValue] as const
}
