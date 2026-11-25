import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Tale, TalesState } from '@/features/tales'

const talesInitial: TalesState = {
  dataSheet: 'Сказки',
  dataTale: [],
  loading: false,
  error: null,
}

export const talesSlice = createSlice({
  name: 'tales',
  initialState: talesInitial,
  reducers: {
    setTales(state, action: PayloadAction<{ dataSheet: string; dataTale: Tale[] }>) {
      state.dataSheet = action.payload.dataSheet
      state.dataTale = action.payload.dataTale
      state.loading = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setTales, setLoading, setError } = talesSlice.actions