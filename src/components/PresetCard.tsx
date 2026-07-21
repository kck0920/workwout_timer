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
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        border: '1px solid var(--color-border)',
        transition: 'var(--transition-fast)',
      }}
    >
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          marginBottom: 'var(--space-sm)',
          color: 'var(--color-text)',
        }}
      >
        {preset.name}
      </h3>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-md)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        <span>{exerciseCount}개 운동</span>
        <span>{preset.sets}세트</span>
        <span>{formatDuration(totalDuration)}</span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={() => onStart(preset)}
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 'var(--font-size-sm)',
          }}
        >
          시작
        </button>
        <button
          type="button"
          onClick={() => onEdit(preset)}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface-variant)',
            color: 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          편집
        </button>
      </div>
    </div>
  )
}
