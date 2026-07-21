import { useEffect, useRef } from 'react'

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
          .then(() => {
            wakeLockRef.current = null
          })
          .catch((err: any) => console.error('Error releasing wake lock:', err))
      }
      return
    }

    const requestWakeLock = async () => {
      if (!('wakeLock' in navigator)) {
        return
      }
      try {
        if (wakeLockRef.current) {
          return
        }
        const sentinel = await navigator.wakeLock.request('screen')
        wakeLockRef.current = sentinel
        
        sentinel.addEventListener('release', () => {
          if (wakeLockRef.current === sentinel) {
            wakeLockRef.current = null
          }
        })
      } catch (err) {
        console.warn('Failed to acquire screen wake lock:', err)
      }
    }

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await requestWakeLock()
      }
    }

    requestWakeLock()

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
          .then(() => {
            wakeLockRef.current = null
          })
          .catch((err: any) => console.error('Error releasing wake lock on cleanup:', err))
      }
    }
  }, [enabled])
}
