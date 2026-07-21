import type { WorkoutRecord } from '../lib/types'

interface WorkoutHistoryProps {
  records: WorkoutRecord[]
  onDelete: (id: string) => void
}

export function WorkoutHistory({ records, onDelete }: WorkoutHistoryProps) {
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              transition: 'all var(--transition-fast)',
            }}
          >
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
        ))}
      </div>
    </div>
  )
}
