import { useState, useEffect, useCallback } from 'react'
import type { Preset } from '../lib/types'
import { getAllPresets } from '../lib/db'

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPresets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPresets()
      setPresets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '프리셋 로드 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllPresets()
        if (!cancelled) {
          setPresets(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '프리셋 로드 실패')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { presets, loading, error, refresh: loadPresets }
}
