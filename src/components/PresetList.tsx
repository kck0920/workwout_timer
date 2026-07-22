import { useRef, useCallback, useState } from 'react'
import type { Preset } from '../lib/types'
import { importPreset } from '../lib/db'
import { PresetCard } from './PresetCard'

interface PresetListProps {
  presets: Preset[]
  onStart: (preset: Preset) => void
  onEdit: (preset: Preset) => void
  onImport: () => void
}

export function PresetList({ presets, onStart, onEdit, onImport }: PresetListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportError(null)
    try {
      const text = await file.text()
      await importPreset(text)
      onImport()
    } catch (err) {
      setImportError(err instanceof Error ? err.message : '가져오기에 실패했습니다.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onImport])

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
    <div>
      <div
        style={{
          padding: '0 var(--space-md)',
          marginBottom: 'var(--space-md)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          프리셋 가져오기
        </button>
        {importError && (
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: 'var(--space-xs)', textAlign: 'center' }}>
            {importError}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gap: 'var(--space-md)',
          padding: '0 var(--space-md)',
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
    </div>
  )
}
