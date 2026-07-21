import { useEffect, useCallback, useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useFeedback } from '../hooks/useFeedback'
import { CircularProgress } from './CircularProgress'
import type { Preset } from '../lib/types'
import { createRecord } from '../lib/db'

interface WorkoutScreenProps {
  preset: Preset
  onComplete: () => void
  onExit: () => void
}

export function WorkoutScreen({ preset, onComplete, onExit }: WorkoutScreenProps) {
  const timer = useTimer()
  const feedback = useFeedback()
  const [completed, setCompleted] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const [startTime] = useState(() => Date.now())

  useEffect(() => {
    timer.load(preset)
  }, [preset, timer.load])

  useEffect(() => {
    if (timer.state === 'exercising') {
      feedback.play('exercise')
    } else if (timer.state === 'resting') {
      feedback.play('rest')
    }
  }, [timer.state, feedback.play])

  useEffect(() => {
    if (timer.countdown !== null && timer.countdown > 0) {
      feedback.play('countdown')
    }
  }, [timer.countdown, feedback.play])

  useEffect(() => {
    if (timer.state === 'completed' && !completed) {
      setCompleted(true)
      setTotalDuration(Math.floor((Date.now() - startTime) / 1000))
      feedback.play('workoutComplete')

      createRecord({
        presetId: preset.id,
        presetName: preset.name,
        duration: Math.floor((Date.now() - startTime) / 1000),
      })
    }
  }, [timer.state, completed, preset, startTime, feedback.play])

  const handleStart = useCallback(() => {
    timer.start()
  }, [timer.start])

  const handlePause = useCallback(() => {
    if (timer.state === 'paused') {
      timer.start()
    } else {
      timer.pause()
    }
  }, [timer.state, timer.start, timer.pause])

  const handleSkip = useCallback(() => {
    timer.skip()
  }, [timer.skip])

  const handleReset = useCallback(() => {
    timer.reset()
    setCompleted(false)
  }, [timer.reset])

  if (completed) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 'var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>🎉</div>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>
          운동 완료!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          {preset.name}
        </p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
          총 시간: {Math.floor(totalDuration / 60)}분 {totalDuration % 60}초
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%', maxWidth: '300px' }}>
          <button
            type="button"
            onClick={onComplete}
            style={{
              flex: 1,
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            홈으로
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              flex: 1,
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-surface-variant)',
              color: 'var(--color-text)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--space-lg)',
      }}
    >
      {/* Exercise Info */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-xs)' }}>
          {timer.currentExercise?.name || preset.name}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          세트 {timer.currentSet} / {timer.totalSets}
        </p>
      </div>

      {/* Circular Progress */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <CircularProgress
          progress={timer.progress}
          remaining={timer.remaining}
          isExercise={timer.state === 'exercising'}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%', maxWidth: '300px' }}>
        {timer.state === 'idle' ? (
          <button
            type="button"
            onClick={handleStart}
            style={{
              flex: 1,
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--font-size-lg)',
            }}
          >
            시작
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePause}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-variant)',
                color: 'var(--color-text)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {timer.state === 'paused' ? '계속' : '일시정지'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={timer.state === 'paused'}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-variant)',
                color: 'var(--color-text)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: timer.state === 'paused' ? 'not-allowed' : 'pointer',
                opacity: timer.state === 'paused' ? 0.5 : 1,
              }}
            >
              건너뛰기
            </button>
          </>
        )}
      </div>

      {/* Exit button */}
      <button
        type="button"
        onClick={onExit}
        style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        종료
      </button>
    </div>
  )
}
