import { useSelector } from 'react-redux'
import type { RootState } from '@/shared/store/store'

export const selectBleState = (state: RootState) => state.ble
export const selectBleStatus = (state: RootState) => state.ble.status
export const selectBattery = (state: RootState) => state.ble.battery
export const selectIsPlaying = (state: RootState) => state.ble.isPlaying
export const selectTalesState = (state: RootState) => state.tales
export const selectTalesData = (state: RootState) => state.tales.dataTale
export const selectDataSheet = (state: RootState) => state.tales.dataSheet
export const selectTalesLoading = (state: RootState) => state.tales.loading