interface CircularProgressProps {
  progress: number
  remaining: number
  isExercise: boolean
}

export function CircularProgress({
  progress,
  remaining,
  isExercise,
}: CircularProgressProps) {
  const strokeWidth = 4.3
  const radius = (100 - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`
  }

  const color = isExercise ? 'var(--color-primary)' : 'var(--color-secondary)'

  return (
    <div className="timer-circle-container">
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '100%',
          height: '100%',
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke="var(--color-surface-variant)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      {/* Timer display */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span className="timer-text-time">
          {formatTime(remaining)}
        </span>
        <span className="timer-text-label">
          {isExercise ? '운동 중' : '휴식 중'}
        </span>
      </div>
    </div>
  )
}
