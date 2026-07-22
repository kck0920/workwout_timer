import type { Preset, Exercise } from './types'

export type TimerState = 'idle' | 'exercising' | 'resting' | 'paused' | 'completed'

export interface TimerCallbacks {
  onTick?: (remaining: number, total: number) => void
  onStateChange?: (state: TimerState) => void
  onTransition?: (exercise: Exercise, setIndex: number, exerciseIndex: number) => void
  onSetComplete?: (setIndex: number) => void
  onComplete?: () => void
  onCountdown?: (seconds: number) => void
}

interface TimerStep {
  exercise: Exercise
  setIndex: number
  exerciseIndex: number
}

export class TimerEngine {
  private preset: Preset | null = null
  private steps: TimerStep[] = []
  private currentStepIndex = 0
  private remaining = 0
  private totalDuration = 0
  private state: TimerState = 'idle'
  private intervalId: number | null = null
  private lastTickTime = 0
  private callbacks: TimerCallbacks = {}
  private handleVisibilityChange: (() => void) | null = null
  private lastCountdownSecond = 0

  constructor(callbacks: TimerCallbacks = {}) {
    this.callbacks = callbacks
  }

  private bindVisibilityChange(): void {
    this.unbindVisibilityChange()
    this.handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && this.state !== 'paused') {
        this.tick()
      }
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private unbindVisibilityChange(): void {
    if (this.handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange)
      this.handleVisibilityChange = null
    }
  }

  load(preset: Preset): void {
    this.preset = preset
    this.steps = this.buildSteps(preset)
    this.currentStepIndex = 0
    this.state = 'idle'
    this.stopTimer()
  }

  private buildSteps(preset: Preset): TimerStep[] {
    const steps: TimerStep[] = []
    for (let setIndex = 0; setIndex < preset.sets; setIndex++) {
      for (let exerciseIndex = 0; exerciseIndex < preset.exercises.length; exerciseIndex++) {
        steps.push({
          exercise: preset.exercises[exerciseIndex],
          setIndex,
          exerciseIndex,
        })
      }
    }
    return steps
  }

  start(): void {
    if (this.state !== 'idle' && this.state !== 'paused') return
    if (this.steps.length === 0) return

    if (this.state === 'paused') {
      this.resumeTimer()
      return
    }

    this.currentStepIndex = 0
    this.startCurrentStep()
  }

  private startCurrentStep(): void {
    if (this.currentStepIndex >= this.steps.length) {
      this.complete()
      return
    }

    const step = this.steps[this.currentStepIndex]
    this.totalDuration = step.exercise.duration
    this.remaining = step.exercise.duration
    this.lastCountdownSecond = 0
    this.state = step.exercise.type === 'exercise' ? 'exercising' : 'resting'

    this.callbacks.onStateChange?.(this.state)
    this.callbacks.onTransition?.(
      step.exercise,
      step.setIndex,
      step.exerciseIndex
    )
    this.callbacks.onTick?.(this.remaining, this.totalDuration)

    this.startTimer()
  }

  private startTimer(): void {
    this.stopTimer()
    this.lastTickTime = performance.now()
    this.bindVisibilityChange()

    this.intervalId = window.setInterval(() => {
      this.tick()
    }, 100)
  }

  private tick(): void {
    const now = performance.now()
    const elapsed = (now - this.lastTickTime) / 1000
    this.lastTickTime = now

    this.remaining = Math.max(0, this.remaining - elapsed)

    this.callbacks.onTick?.(this.remaining, this.totalDuration)

    const currentSecond = Math.ceil(this.remaining)
    if (currentSecond <= 3 && currentSecond > 0 && currentSecond !== this.lastCountdownSecond) {
      this.lastCountdownSecond = currentSecond
      this.callbacks.onCountdown?.(currentSecond)
    }

    if (this.remaining <= 0) {
      this.onStepComplete()
    }
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.unbindVisibilityChange()
  }

  private resumeTimer(): void {
    this.state = this.steps[this.currentStepIndex].exercise.type === 'exercise'
      ? 'exercising'
      : 'resting'
    this.callbacks.onStateChange?.(this.state)
    this.startTimer()
  }

  private onStepComplete(): void {
    this.stopTimer()

    const currentStep = this.steps[this.currentStepIndex]
    const isLastInSet =
      currentStep.exerciseIndex === this.preset!.exercises.length - 1

    if (isLastInSet) {
      this.callbacks.onSetComplete?.(currentStep.setIndex)
    }

    this.currentStepIndex++
    this.startCurrentStep()
  }

  pause(): void {
    if (this.state !== 'exercising' && this.state !== 'resting') return
    this.stopTimer()
    this.state = 'paused'
    this.callbacks.onStateChange?.(this.state)
  }

  skip(): void {
    if (this.state !== 'exercising' && this.state !== 'resting' && this.state !== 'paused') return
    this.stopTimer()
    this.onStepComplete()
  }

  reset(): void {
    this.stopTimer()
    this.currentStepIndex = 0
    this.remaining = 0
    this.totalDuration = 0
    this.state = 'idle'
    this.callbacks.onStateChange?.(this.state)
  }

  private complete(): void {
    this.state = 'completed'
    this.callbacks.onStateChange?.(this.state)
    this.callbacks.onComplete?.()
  }

  getState(): TimerState {
    return this.state
  }

  getCurrentStep(): TimerStep | null {
    if (this.currentStepIndex >= this.steps.length) return null
    return this.steps[this.currentStepIndex]
  }

  getNextStep(): TimerStep | null {
    const nextIndex = this.currentStepIndex + 1
    if (nextIndex >= this.steps.length) return null
    return this.steps[nextIndex]
  }

  getProgress(): number {
    if (this.totalDuration === 0) return 0
    return 1 - this.remaining / this.totalDuration
  }

  getRemaining(): number {
    return this.remaining
  }

  getTotalDuration(): number {
    return this.totalDuration
  }

  destroy(): void {
    this.stopTimer()
    this.unbindVisibilityChange()
  }
}
