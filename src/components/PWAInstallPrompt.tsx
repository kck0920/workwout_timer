import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (deferredPrompt) {
      const hasShown = localStorage.getItem('pwa-install-shown')
      if (!hasShown) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowPrompt(true)
      }
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-shown', 'true')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-shown', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-lg)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2 * var(--space-lg))',
        maxWidth: '520px',
        backgroundColor: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md) var(--space-lg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', minWidth: '240px' }}>
        <span style={{ fontSize: '24px' }}>📱</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text)' }}>
            홈 화면에 앱 추가
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            오프라인에서도 편리하게 타이머를 사용하세요
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={handleInstall}
          className="btn btn-primary"
          style={{
            padding: 'var(--space-xs) var(--space-sm)',
            fontSize: 'var(--font-size-xs)',
            minHeight: '36px',
          }}
        >
          설치
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="btn btn-secondary"
          style={{
            padding: 'var(--space-xs) var(--space-sm)',
            fontSize: 'var(--font-size-xs)',
            minHeight: '36px',
            backgroundColor: 'transparent',
          }}
        >
          나중에
        </button>
      </div>
    </div>
  )
}
