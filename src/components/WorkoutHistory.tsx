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
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-md)',
        }}
      >
        최근 기록
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {records.slice(0, 5).map((record) => (
          <div
            key={record.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text)' }}>{record.presetName}</span>
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 'var(--space-sm)' }}>
                {formatDate(record.completedAt)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
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
                  padding: '2px',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
