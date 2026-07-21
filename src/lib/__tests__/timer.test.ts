import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerEngine } from '../timer'
import type { Preset } from '../types'

describe('TimerEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createTestPreset = (): Preset => ({
    id: 'test-1',
    name: '테스트 프리셋',
    exercises: [
      { name: '스쿼트', type: 'exercise', duration: 10 },
      { name: '휴식', type: 'rest', duration: 5 },
    ],
    sets: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  it('should load a preset', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    
    expect(engine.getState()).toBe('idle')
  })

  it('should start from idle state', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    
    expect(engine.getState()).toBe('exercising')
  })

  it('should not start if not idle or paused', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    
    // Already started, should not restart
    engine.start()
    
    expect(engine.getState()).toBe('exercising')
  })

  it('should pause from exercising state', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    engine.pause()
    
    expect(engine.getState()).toBe('paused')
  })

  it('should resume from paused state', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    engine.pause()
    engine.start()
    
    expect(engine.getState()).toBe('exercising')
  })

  it('should skip to next step', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    engine.skip()
    
    // Should move to rest
    expect(engine.getState()).toBe('resting')
  })

  it('should reset to idle', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    engine.reset()
    
    expect(engine.getState()).toBe('idle')
  })

  it('should complete after all steps', () => {
    const onComplete = vi.fn()
    const engine = new TimerEngine({ onComplete })
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    
    // Skip through all exercises (2 sets × 2 exercises = 4 skips)
    engine.skip() // rest
    engine.skip() // exercise 2
    engine.skip() // rest 2
    engine.skip() // complete
    
    expect(onComplete).toHaveBeenCalled()
    expect(engine.getState()).toBe('completed')
  })

  it('should track progress', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    
    expect(engine.getProgress()).toBe(0)
    
    // Simulate time passing
    vi.advanceTimersByTime(5000)
    
    expect(engine.getProgress()).toBeGreaterThan(0)
  })

  it('should get current step', () => {
    const engine = new TimerEngine()
    const preset = createTestPreset()
    
    engine.load(preset)
    
    const step = engine.getCurrentStep()
    expect(step?.exercise.name).toBe('스쿼트')
    expect(step?.setIndex).toBe(0)
  })

  it('should call onSetComplete when a set finishes', () => {
    const onSetComplete = vi.fn()
    const engine = new TimerEngine({ onSetComplete })
    const preset = createTestPreset()
    
    engine.load(preset)
    engine.start()
    
    // Skip through first set (exercise + rest)
    engine.skip() // rest
    engine.skip() // next set
    
    expect(onSetComplete).toHaveBeenCalledWith(0)
  })
})
