import type { Preset } from '../lib/types'

interface PresetCardProps {
  preset: Preset
  onStart: (preset: Preset) => void
  onEdit: (preset: Preset) => void
}

export function PresetCard({ preset, onStart, onEdit }: PresetCardProps) {
  const exerciseCount = preset.exercises.filter((e) => e.type === 'exercise').length
  const totalDuration = preset.exercises.reduce((sum, e) => sum + e.duration, 0) * preset.sets

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}분 ${secs > 0 ? `${secs}초` : ''}` : `${secs}초`
  }

  return (
    <div className="preset-card">
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          marginBottom: 'var(--space-xs)',
          color: 'var(--color-text)',
          fontWeight: 700,
        }}
      >
        {preset.name}
      </h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 500,
        }}
      >
        <span>{exerciseCount}개 운동</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>{preset.sets}세트</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>{formatDuration(totalDuration)}</span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={() => onStart(preset)}
          className="btn btn-primary"
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
          시작
        </button>
        <button
          type="button"
          onClick={() => onEdit(preset)}
          className="btn btn-secondary"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          편집
        </button>
      </div>
    </div>
  )
}
