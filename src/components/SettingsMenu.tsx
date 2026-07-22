import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { SOUND_THEME_LABELS, type SoundTheme } from '../lib/audio'

interface SettingsMenuProps {
  isAudioEnabled: boolean
  isVibrationEnabled: boolean
  isVibrationSupported: boolean
  soundTheme: SoundTheme
  onSetAudioEnabled: (enabled: boolean) => void
  onSetVibrationEnabled: (enabled: boolean) => void
  onSetSoundTheme: (theme: SoundTheme) => void
}

export function SettingsMenu({
  isAudioEnabled,
  isVibrationEnabled,
  isVibrationSupported,
  soundTheme,
  onSetAudioEnabled,
  onSetVibrationEnabled,
  onSetSoundTheme,
}: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="theme-toggle"
        aria-label="설정"
        style={{
          background: 'var(--color-surface-variant)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          fontSize: '18px',
        }}
      >
        ⚙️
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={handleClose}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
                maxWidth: '360px',
                width: '90%',
                border: '1.5px solid var(--color-border)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                설정
              </h3>

              {/* Sound Toggle */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>알림 소리</span>
                  <input
                    type="checkbox"
                    checked={isAudioEnabled}
                    onChange={(e) => onSetAudioEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Sound Theme */}
              {isAudioEnabled && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
                    소리 스타일
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    {(Object.keys(SOUND_THEME_LABELS) as SoundTheme[]).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => onSetSoundTheme(theme)}
                        className={soundTheme === theme ? 'btn btn-primary' : 'btn btn-secondary'}
                        style={{
                          flex: 1,
                          padding: 'var(--space-xs)',
                          fontSize: 'var(--font-size-xs)',
                          minHeight: 'auto',
                        }}
                      >
                        {SOUND_THEME_LABELS[theme]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vibration Toggle */}
              {isVibrationSupported && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>진동</span>
                    <input
                      type="checkbox"
                      checked={isVibrationEnabled}
                      onChange={(e) => onSetVibrationEnabled(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                닫기
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
