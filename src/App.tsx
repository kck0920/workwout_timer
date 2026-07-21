import { useState, useCallback } from 'react'
import { usePresets } from './hooks/usePresets'
import { useWorkoutRecords } from './hooks/useWorkoutRecords'
import { ThemeToggle } from './components/ThemeToggle'
import { PresetList } from './components/PresetList'
import { PresetEditor } from './components/PresetEditor'
import { WorkoutScreen } from './components/WorkoutScreen'
import { WorkoutHistory } from './components/WorkoutHistory'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import type { Preset } from './lib/types'
import './styles/globals.css'

type Screen = 'home' | 'editor' | 'workout'

function App() {
  // Theme initialized via useTheme hook
  const { presets, loading, error, refresh } = usePresets()
  const { records, refresh: refreshRecords, removeRecord } = useWorkoutRecords()
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)

  const handleStart = useCallback((preset: Preset) => {
    setSelectedPreset(preset)
    setScreen('workout')
  }, [])

  const handleEdit = useCallback((preset: Preset) => {
    setSelectedPreset(preset)
    setScreen('editor')
  }, [])

  const handleNewPreset = useCallback(() => {
    setSelectedPreset(null)
    setScreen('editor')
  }, [])

  const handleSave = useCallback(() => {
    setScreen('home')
    setSelectedPreset(null)
    refresh()
  }, [refresh])

  const handleDelete = useCallback(() => {
    setScreen('home')
    setSelectedPreset(null)
    refresh()
  }, [refresh])

  const handleBack = useCallback(() => {
    setScreen('home')
    setSelectedPreset(null)
    refresh()
  }, [refresh])

  const handleWorkoutComplete = useCallback(() => {
    setScreen('home')
    setSelectedPreset(null)
    refresh()
    refreshRecords()
  }, [refresh, refreshRecords])

  const handleWorkoutExit = useCallback(() => {
    setScreen('home')
    setSelectedPreset(null)
  }, [])

  const handleDeleteRecord = useCallback((id: string) => {
    removeRecord(id)
  }, [removeRecord])

  if (screen === 'workout' && selectedPreset) {
    return (
      <div className="app">
        <WorkoutScreen
          preset={selectedPreset}
          onComplete={handleWorkoutComplete}
          onExit={handleWorkoutExit}
        />
        <PWAInstallPrompt />
      </div>
    )
  }

  return (
    <div className="app">
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md)',
          zIndex: 100,
          backgroundColor: 'var(--color-bg)',
        }}
      >
        {screen !== 'home' ? (
          <button
            type="button"
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-md)',
            }}
          >
            ← 뒤로
          </button>
        ) : (
          <span />
        )}
        <ThemeToggle />
      </header>

      <div className="app-layout">
        {/* Sidebar: Preset List + History */}
        <aside className="app-sidebar" style={{ paddingTop: '60px' }}>
          <div style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
              Workout Timer
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              세트 기반 인터벌 운동 타이머
            </p>
          </div>

          <div style={{ padding: '0 var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <button
              type="button"
              onClick={handleNewPreset}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--font-size-md)',
              }}
            >
              + 새 프리셋 만들기
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              로딩 중...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-error)' }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <PresetList
              presets={presets}
              onStart={handleStart}
              onEdit={handleEdit}
            />
          )}

          <WorkoutHistory
            records={records}
            onDelete={handleDeleteRecord}
          />
        </aside>

        {/* Main Content */}
        <main className="app-main" style={{ paddingTop: '60px' }}>
          {screen === 'home' && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p>프리셋을 선택하거나 새로 만들어보세요</p>
            </div>
          )}

          {screen === 'editor' && (
            <PresetEditor
              preset={selectedPreset}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={handleBack}
            />
          )}
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

export default App
