import { useState, useEffect, useCallback } from 'react'
import type { WorkoutRecord } from '../lib/types'
import { getAllRecords, deleteRecord } from '../lib/db'

export function useWorkoutRecords() {
  const [records, setRecords] = useState<WorkoutRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllRecords()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '기록 로드 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  const removeRecord = useCallback(async (id: string) => {
    try {
      await deleteRecord(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete record:', err)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  return { records, loading, error, refresh: loadRecords, removeRecord }
}
