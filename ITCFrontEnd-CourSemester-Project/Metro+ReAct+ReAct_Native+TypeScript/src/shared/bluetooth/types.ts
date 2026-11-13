export const BLE_UUIDS = {
  SERVICE: '0000XXXX-0000-1000-8000-00805F9B34FB',
  COMMAND_CHAR: '0000YYYY-0000-1000-8000-00805F9B34FB',
  STATUS_CHAR: '0000ZZZZ-0000-1000-8000-00805F9B34FB',
  BATTERY_CHAR: '0000BBBB-0000-1000-8000-00805F9B34FB',
  PROGRESS_CHAR: '0000PPPP-0000-1000-8000-00805F9B34FB',
} as const

export type BleStatus = 'idle' | 'scanning' | 'connecting' | 'connected' | 'disconnected' | 'error'

export type BoardState = {
  status: BleStatus
  battery: number | null
  progress: number
  duration: number
  isPlaying: boolean
  deviceName?: string
}

export type Command = 'START' | 'PAUSE' | 'SEEK'