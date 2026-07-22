import { useEffect, useCallback, useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useFeedback } from '../hooks/useFeedback'
import { CircularProgress } from './CircularProgress'
import type { Preset } from '../lib/types'
import { createRecord, updateRecordMemo } from '../lib/db'

interface WorkoutScreenProps {
  preset: Preset
  onComplete: () => void
  onExit: () => void
}

export function WorkoutScreen({ preset, onComplete, onExit }: WorkoutScreenProps) {
  const {
    state: timerState,
    remaining,
    progress,
    currentExercise,
    currentSet,
    totalSets,
    countdown,
    nextExercise,
    load,
    start,
    pause,
    skip,
    reset,
  } = useTimer()
  
  const { play } = useFeedback()
  const [completed, setCompleted] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const [startTime] = useState(() => Date.now())
  const [memo, setMemo] = useState('')
  const [recordId, setRecordId] = useState<string | null>(null)

  useEffect(() => {
    load(preset)
  }, [preset, load])

  useEffect(() => {
    if (timerState === 'exercising') {
      play('exercise')
    } else if (timerState === 'resting') {
      play('rest')
    }
  }, [timerState, play])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      play('countdown')
    }
  }, [countdown, play])

  useEffect(() => {
    if (timerState === 'completed' && !completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompleted(true)
      setTotalDuration(Math.floor((Date.now() - startTime) / 1000))
      play('workoutComplete')

      createRecord({
        presetId: preset.id,
        presetName: preset.name,
        duration: Math.floor((Date.now() - startTime) / 1000),
      }).then((record) => {
        setRecordId(record.id)
      })
    }
  }, [timerState, completed, preset, startTime, play])

  const handleStart = useCallback(() => {
    start()
  }, [start])

  const handlePause = useCallback(() => {
    if (timerState === 'paused') {
      start()
    } else {
      pause()
    }
  }, [timerState, start, pause])

  const handleSkip = useCallback(() => {
    skip()
  }, [skip])

  const handleReset = useCallback(() => {
    reset()
    setCompleted(false)
  }, [reset])

  const handleSaveMemo = useCallback(async () => {
    if (recordId && memo.trim()) {
      await updateRecordMemo(recordId, memo.trim())
    }
    onComplete()
  }, [recordId, memo, onComplete])

  if (completed) {
    return (
      <div
        className="workout-screen-container"
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>🎉</div>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)', fontWeight: 800 }}>
          운동 완료!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          {preset.name}
        </p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
          총 시간: {Math.floor(totalDuration / 60)}분 {totalDuration % 60}초
        </p>

        {/* Memo Input */}
        <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'left' }}>
          <label
            htmlFor="workout-memo"
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-xs)',
              fontWeight: 500,
            }}
          >
            운동 메모 (선택사항)
          </label>
          <textarea
            id="workout-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 운동에 대한 메모를 남겨보세요..."
            rows={3}
            className="form-input"
            style={{
              width: '100%',
              resize: 'vertical',
              minHeight: '80px',
            }}
          />
        </div>

        <div className="workout-controls" style={{ gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={handleSaveMemo}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: 'var(--space-md)',
            }}
          >
            홈으로
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: 'var(--space-md)',
            }}
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="workout-screen-container">
      {/* Exercise Info */}
      <div className="workout-info">
        <h2 className="workout-title">
          {timerState === 'resting' && nextExercise
            ? nextExercise.name
            : currentExercise?.name || preset.name}
        </h2>
        <p className="workout-sets">
          {timerState === 'resting' && nextExercise
            ? `다음 운동: ${nextExercise.name}`
            : `세트 ${currentSet} / ${totalSets}`}
        </p>
      </div>

      {/* Circular Progress */}
      <CircularProgress
        progress={progress}
        remaining={remaining}
        isExercise={timerState === 'exercising'}
        exerciseName={
          timerState === 'resting'
            ? '휴식'
            : currentExercise?.name || preset.name
        }
      />

      {/* Controls */}
      <div className="workout-controls">
        {timerState === 'idle' ? (
          <button
            type="button"
            onClick={handleStart}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: 'var(--space-md)',
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
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: 'var(--space-md)',
              }}
            >
              {timerState === 'paused' ? '계속' : '일시정지'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={timerState === 'paused'}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: 'var(--space-md)',
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
        className="btn btn-secondary"
        style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-xs) var(--space-md)',
          minHeight: 'auto',
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
      >
        종료
      </button>
    </div>
  )
}
