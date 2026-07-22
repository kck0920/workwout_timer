export type SoundType = 'exercise' | 'rest' | 'setComplete' | 'workoutComplete' | 'countdown'
export type SoundTheme = 'classic' | 'modern' | 'minimal'

const SOUND_THEMES: Record<SoundTheme, Record<SoundType, { frequency: number; duration: number; count: number }>> = {
  classic: {
    exercise: { frequency: 880, duration: 0.1, count: 1 },
    rest: { frequency: 440, duration: 0.3, count: 1 },
    setComplete: { frequency: 660, duration: 0.1, count: 2 },
    workoutComplete: { frequency: 880, duration: 0.1, count: 3 },
    countdown: { frequency: 660, duration: 0.1, count: 1 },
  },
  modern: {
    exercise: { frequency: 1047, duration: 0.08, count: 2 },
    rest: { frequency: 523, duration: 0.2, count: 1 },
    setComplete: { frequency: 784, duration: 0.08, count: 3 },
    workoutComplete: { frequency: 1047, duration: 0.15, count: 4 },
    countdown: { frequency: 784, duration: 0.08, count: 1 },
  },
  minimal: {
    exercise: { frequency: 600, duration: 0.05, count: 1 },
    rest: { frequency: 400, duration: 0.15, count: 1 },
    setComplete: { frequency: 600, duration: 0.05, count: 2 },
    workoutComplete: { frequency: 600, duration: 0.1, count: 3 },
    countdown: { frequency: 600, duration: 0.05, count: 1 },
  },
}

export const SOUND_THEME_LABELS: Record<SoundTheme, string> = {
  classic: '클래식',
  modern: '모던',
  minimal: '미니멀',
}

export class AudioManager {
  private audioContext: AudioContext | null = null
  private enabled = true
  private theme: SoundTheme = 'classic'

  constructor() {
    const saved = localStorage.getItem('soundTheme')
    if (saved && saved in SOUND_THEMES) {
      this.theme = saved as SoundTheme
    }
    const savedEnabled = localStorage.getItem('audioEnabled')
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true'
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }
    return this.audioContext
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    localStorage.setItem('audioEnabled', String(enabled))
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setTheme(theme: SoundTheme): void {
    this.theme = theme
    localStorage.setItem('soundTheme', theme)
  }

  getTheme(): SoundTheme {
    return this.theme
  }

  private playBeep(frequency: number, duration: number, count = 1): void {
    if (!this.enabled) return

    const ctx = this.getContext()
    const now = ctx.currentTime

    for (let i = 0; i < count; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, now + i * 0.15)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + duration)

      oscillator.start(now + i * 0.15)
      oscillator.stop(now + i * 0.15 + duration)
    }
  }

  play(type: SoundType): void {
    const sound = SOUND_THEMES[this.theme][type]
    this.playBeep(sound.frequency, sound.duration, sound.count)
  }
}
