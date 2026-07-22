import { useRef, useCallback, useState } from 'react'
import { AudioManager, type SoundTheme } from '../lib/audio'
import { VibrationManager } from '../lib/vibration'

type FeedbackType = 'exercise' | 'rest' | 'setComplete' | 'workoutComplete' | 'countdown'

export function useFeedback() {
  const audioRef = useRef<AudioManager | null>(null)
  if (!audioRef.current) {
    audioRef.current = new AudioManager()
  }

  const vibrationRef = useRef<VibrationManager | null>(null)
  if (!vibrationRef.current) {
    vibrationRef.current = new VibrationManager()
  }

  const [isAudioEnabledState, setIsAudioEnabledState] = useState<boolean>(() => audioRef.current!.isEnabled())
  const [isVibrationEnabledState, setIsVibrationEnabledState] = useState<boolean>(() => vibrationRef.current!.isEnabled())
  const [soundThemeState, setSoundThemeState] = useState<SoundTheme>(() => audioRef.current!.getTheme())

  const play = useCallback((type: FeedbackType) => {
    audioRef.current?.play(type)
    vibrationRef.current?.vibrate(type)
  }, [])

  const setAudioEnabled = useCallback((enabled: boolean) => {
    audioRef.current?.setEnabled(enabled)
    setIsAudioEnabledState(enabled)
    if (enabled) {
      audioRef.current?.play('exercise')
    }
  }, [])

  const setVibrationEnabled = useCallback((enabled: boolean) => {
    vibrationRef.current?.setEnabled(enabled)
    setIsVibrationEnabledState(enabled)
    if (enabled) {
      vibrationRef.current?.vibrate('exercise')
    }
  }, [])

  const setSoundTheme = useCallback((theme: SoundTheme) => {
    audioRef.current?.setTheme(theme)
    setSoundThemeState(theme)
    audioRef.current?.play('exercise')
  }, [])

  const getSoundTheme = useCallback(() => {
    return soundThemeState
  }, [soundThemeState])

  return {
    play,
    setAudioEnabled,
    setVibrationEnabled,
    setSoundTheme,
    getSoundTheme,
    isAudioEnabled: () => isAudioEnabledState,
    isVibrationEnabled: () => isVibrationEnabledState,
    isVibrationSupported: () => vibrationRef.current?.isSupported() ?? false,
  }
}
