type VibrationPattern = 'exercise' | 'rest' | 'setComplete' | 'workoutComplete' | 'countdown'

export class VibrationManager {
  private enabled = true
  private supported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  constructor() {
    const savedEnabled = localStorage.getItem('vibrationEnabled')
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true'
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    localStorage.setItem('vibrationEnabled', String(enabled))
  }

  isEnabled(): boolean {
    return this.enabled
  }

  isSupported(): boolean {
    return this.supported
  }

  vibrate(pattern: VibrationPattern): void {
    if (!this.enabled || !this.supported) return

    switch (pattern) {
      case 'exercise':
        navigator.vibrate(100)
        break
      case 'rest':
        navigator.vibrate(200)
        break
      case 'setComplete':
        navigator.vibrate([100, 50, 100])
        break
      case 'workoutComplete':
        navigator.vibrate([100, 50, 100, 50, 100])
        break
      case 'countdown':
        navigator.vibrate(50)
        break
    }
  }
}
