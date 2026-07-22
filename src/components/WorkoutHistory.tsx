import { useState, useCallback } from 'react'
import type { WorkoutRecord } from '../lib/types'
import { updateRecordMemo } from '../lib/db'

interface WorkoutHistoryProps {
  records: WorkoutRecord[]
  onDelete: (id: string) => void
}

export function WorkoutHistory({ records, onDelete }: WorkoutHistoryProps) {
  const [editingMemo, setEditingMemo] = useState<string | null>(null)
  const [memoValue, setMemoValue] = useState('')

  const handleStartEditMemo = useCallback((record: WorkoutRecord) => {
    setEditingMemo(record.id)
    setMemoValue(record.memo || '')
  }, [])

  const handleSaveMemo = useCallback(async (id: string) => {
    await updateRecordMemo(id, memoValue.trim())
    setEditingMemo(null)
    setMemoValue('')
  }, [memoValue])

  const handleCancelEditMemo = useCallback(() => {
    setEditingMemo(null)
    setMemoValue('')
  }, [])

  if (records.length === 0) {
    return null
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }

  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <h3
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-md)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        최근 기록
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {records.slice(0, 5).map((record) => (
          <div
            key={record.id}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{record.presetName}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                  {formatDate(record.completedAt)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-surface-variant)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  {formatDuration(record.duration)}
                </span>
                {record.memo && editingMemo !== record.id && (
                  <button
                    type="button"
                    onClick={() => handleStartEditMemo(record)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: 'var(--font-size-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="메모 보기"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </button>
                )}
                {!record.memo && editingMemo !== record.id && (
                  <button
                    type="button"
                    onClick={() => handleStartEditMemo(record)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: 'var(--font-size-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="메모 추가"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: 'var(--font-size-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  title="기록 삭제"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Memo Display/Edit */}
            {editingMemo === record.id && (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <textarea
                  value={memoValue}
                  onChange={(e) => setMemoValue(e.target.value)}
                  placeholder="메모를 입력하세요..."
                  rows={2}
                  className="form-input"
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    minHeight: '60px',
                    fontSize: 'var(--font-size-xs)',
                  }}
                />
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveMemo(record.id)}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: 'var(--font-size-xs)',
                      minHeight: 'auto',
                    }}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEditMemo}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: 'var(--font-size-xs)',
                      minHeight: 'auto',
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {editingMemo !== record.id && record.memo && (
              <div
                style={{
                  marginTop: 'var(--space-xs)',
                  padding: 'var(--space-xs)',
                  backgroundColor: 'var(--color-surface-variant)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {record.memo}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
