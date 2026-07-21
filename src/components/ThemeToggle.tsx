import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
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
        fontSize: '20px',
      }}
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
