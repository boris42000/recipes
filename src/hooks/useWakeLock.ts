import { useEffect, useState } from 'react'

export type WakeLockStatus = 'pending' | 'active' | 'unsupported'

/** Keep the screen on while `enabled`. Re-acquires the lock after the tab becomes visible again. */
export function useWakeLock(enabled: boolean): WakeLockStatus {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [status, setStatus] = useState<WakeLockStatus>(supported ? 'pending' : 'unsupported')

  useEffect(() => {
    if (!enabled || !supported) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) return void lock.release()
        sentinel = lock
        setStatus('active')
        lock.addEventListener('release', () => !cancelled && setStatus('pending'))
      } catch {
        setStatus('pending') // e.g. battery saver; we'll retry on the next visibility change
      }
    }
    // The browser drops the lock whenever the page is hidden (screen off, app switch).
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void sentinel?.release()
    }
  }, [enabled, supported])

  return status
}
