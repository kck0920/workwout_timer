import { useRef, useCallback } from 'react'
import { AudioManager } from '../lib/audio'
import { VibrationManager } from '../lib/vibration'

type FeedbackType = 'exercise' | 'rest' | 'setComplete' | 'workoutComplete' | 'countdown'

export function useFeedback() {
  const audioRef = useRef(new AudioManager())
  const vibrationRef = useRef(new VibrationManager())

  const play = useCallback((type: FeedbackType) => {
    audioRef.current.play(type)
    vibrationRef.current.vibrate(type)
  }, [])

  const setAudioEnabled = useCallback((enabled: boolean) => {
    audioRef.current.setEnabled(enabled)
  }, [])

  const setVibrationEnabled = useCallback((enabled: boolean) => {
    vibrationRef.current.setEnabled(enabled)
  }, [])

  return {
    play,
    setAudioEnabled,
    setVibrationEnabled,
    isAudioEnabled: () => audioRef.current.isEnabled(),
    isVibrationEnabled: () => vibrationRef.current.isEnabled(),
    isVibrationSupported: () => vibrationRef.current.isSupported(),
  }
}
