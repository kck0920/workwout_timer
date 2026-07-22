import { useState, useCallback, useRef, useEffect } from 'react'
import { TimerEngine } from '../lib/timer'
import type { TimerState } from '../lib/timer'
import type { Preset, Exercise } from '../lib/types'

interface TimerInfo {
  state: TimerState
  remaining: number
  totalDuration: number
  progress: number
  currentExercise: Exercise | null
  currentSet: number
  totalSets: number
  countdown: number | null
  nextExercise: Exercise | null
}

const initialState: TimerInfo = {
  state: 'idle',
  remaining: 0,
  totalDuration: 0,
  progress: 0,
  currentExercise: null,
  currentSet: 0,
  totalSets: 0,
  countdown: null,
  nextExercise: null,
}

export function useTimer() {
  const engineRef = useRef<TimerEngine | null>(null)
  const [timerInfo, setTimerInfo] = useState<TimerInfo>(initialState)

  const updateInfo = useCallback((engine: TimerEngine, preset: Preset | null) => {
    const step = engine.getCurrentStep()
    const nextStep = engine.getNextStep()
    setTimerInfo((prev) => ({
      state: engine.getState(),
      remaining: engine.getRemaining(),
      totalDuration: engine.getTotalDuration(),
      progress: engine.getProgress(),
      currentExercise: step?.exercise ?? null,
      currentSet: step ? step.setIndex + 1 : 0,
      totalSets: preset?.sets ?? 0,
      countdown: prev.countdown,
      nextExercise: nextStep?.exercise ?? null,
    }))
  }, [])

  const load = useCallback((preset: Preset) => {
    if (engineRef.current) {
      engineRef.current.destroy()
    }

    const engine = new TimerEngine({
      onTick: () => {
        if (engineRef.current) {
          updateInfo(engineRef.current, preset)
        }
      },
      onStateChange: () => {
        if (engineRef.current) {
          updateInfo(engineRef.current, preset)
        }
      },
      onTransition: () => {
        if (engineRef.current) {
          updateInfo(engineRef.current, preset)
        }
      },
      onCountdown: (seconds: number) => {
        setTimerInfo((prev) => ({ ...prev, countdown: seconds }))
      },
    })

    engine.load(preset)
    engineRef.current = engine
    updateInfo(engine, preset)
  }, [updateInfo])

  const start = useCallback(() => {
    engineRef.current?.start()
  }, [])

  const pause = useCallback(() => {
    engineRef.current?.pause()
  }, [])

  const skip = useCallback(() => {
    engineRef.current?.skip()
  }, [])

  const reset = useCallback(() => {
    engineRef.current?.reset()
    setTimerInfo(initialState)
  }, [])

  useEffect(() => {
    return () => {
      engineRef.current?.destroy()
    }
  }, [])

  return {
    ...timerInfo,
    load,
    start,
    pause,
    skip,
    reset,
  }
}
