type SoundType = 'exercise' | 'rest' | 'setComplete' | 'workoutComplete' | 'countdown'

export class AudioManager {
  private audioContext: AudioContext | null = null
  private enabled = true

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }
    return this.audioContext
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
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
    switch (type) {
      case 'exercise':
        this.playBeep(880, 0.1, 1)
        break
      case 'rest':
        this.playBeep(440, 0.3, 1)
        break
      case 'setComplete':
        this.playBeep(660, 0.1, 2)
        break
      case 'workoutComplete':
        this.playBeep(880, 0.1, 3)
        break
      case 'countdown':
        this.playBeep(660, 0.1, 1)
        break
    }
  }
}
