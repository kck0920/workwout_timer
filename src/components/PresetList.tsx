import { useRef, useCallback, useState } from 'react'
import type { Preset } from '../lib/types'
import { importPreset, seedDefaultPresets } from '../lib/db'
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
  const [loadingDefaults, setLoadingDefaults] = useState(false)

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

  const handleAddDefaultBodyweight = useCallback(async () => {
    setLoadingDefaults(true)
    try {
      await seedDefaultPresets()
      onImport()
    } catch (err) {
      setImportError(err instanceof Error ? err.message : '맨손 루틴 생성에 실패했습니다.')
    } finally {
      setLoadingDefaults(false)
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
        <button
          type="button"
          onClick={handleAddDefaultBodyweight}
          disabled={loadingDefaults}
          className="btn btn-primary"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {loadingDefaults ? '생성 중...' : '맨손 운동 루틴 3종 생성하기'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          padding: '0 var(--space-md)',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: 'var(--space-xs) var(--space-sm)',
              fontSize: 'var(--font-size-xs)',
              minHeight: '40px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            파일 가져오기
          </button>
          <button
            type="button"
            onClick={handleAddDefaultBodyweight}
            disabled={loadingDefaults}
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: 'var(--space-xs) var(--space-sm)',
              fontSize: 'var(--font-size-xs)',
              minHeight: '40px',
            }}
          >
            🔥 맨손 20분 루틴 3종 추가
          </button>
        </div>
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
