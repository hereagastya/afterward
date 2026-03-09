import { useCallback } from 'react'

export function useSound() {
  const playBell = useCallback(() => {
    // Singing bowl sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})
  }, [])

  const playFlip = useCallback(() => {
    // Clean flip
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3')
    audio.volume = 0.2
    audio.playbackRate = 1.5
    audio.play().catch(() => {})
  }, [])

  const playWhoosh = useCallback(() => {
    // Paper rustle
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
    audio.volume = 0.25
    audio.play().catch(() => {})
  }, [])

  return { playBell, playFlip, playWhoosh }
}
