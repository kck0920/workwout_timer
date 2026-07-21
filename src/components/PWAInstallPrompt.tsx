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
        left: 'var(--space-md)',
        right: 'var(--space-md)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
      }}
    >
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
        홈 화면에 추가하여 앱처럼 사용하세요
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={handleInstall}
          style={{
            flex: 1,
            padding: 'var(--space-sm)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          설치
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          나중에
        </button>
      </div>
    </div>
  )
}
