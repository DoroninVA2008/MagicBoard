import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store/types'

export const selectTalesState = (state: RootState) => state.tales
export const selectTalesData = (state: RootState) => state.tales.dataTale
export const selectDataSheet = (state: RootState) => state.tales.dataSheet
export const selectTalesLoading = (state: RootState) => state.tales.loading