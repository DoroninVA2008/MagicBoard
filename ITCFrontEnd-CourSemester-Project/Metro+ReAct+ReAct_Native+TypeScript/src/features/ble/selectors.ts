import type { RootState } from '@/app/store'

export const selectBleState = (state: RootState) => state.ble
export const selectBleStatus = (state: RootState) => state.ble.status
export const selectBattery = (state: RootState) => state.ble.battery
export const selectIsPlaying = (state: RootState) => state.ble.isPlaying