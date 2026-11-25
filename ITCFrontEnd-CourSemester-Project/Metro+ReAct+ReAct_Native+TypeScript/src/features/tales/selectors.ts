import type { RootState } from '@/app/store'

export const selectTalesState = (state: RootState) => state.tales
export const selectTalesData = (state: RootState) => state.tales.dataTale
export const selectDataSheet = (state: RootState) => state.tales.dataSheet
export const selectTalesLoading = (state: RootState) => state.tales.loading
export const selectTalesError = (state: RootState) => state.tales.error