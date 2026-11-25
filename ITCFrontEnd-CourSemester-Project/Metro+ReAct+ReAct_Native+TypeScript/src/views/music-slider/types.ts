export interface MusicSliderProps {
  taleId?: number
  isActive: boolean
  duration: number
  initialProgress?: number
  onProgressChange?: (ms: number) => void
  onDurationChange?: (ms: number) => void
}