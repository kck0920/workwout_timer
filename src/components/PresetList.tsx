import type { Preset } from '../lib/types'
import { PresetCard } from './PresetCard'

interface PresetListProps {
  presets: Preset[]
  onStart: (preset: Preset) => void
  onEdit: (preset: Preset) => void
}

export function PresetList({ presets, onStart, onEdit }: PresetListProps) {
  if (presets.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          color: 'var(--color-text-muted)',
        }}
      >
        <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-md)' }}>
          프리셋이 없습니다
        </p>
        <p style={{ fontSize: 'var(--font-size-sm)' }}>
          새로운 프리셋을 만들어서 운동을 시작하세요
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
      }}
    >
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          onStart={onStart}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
