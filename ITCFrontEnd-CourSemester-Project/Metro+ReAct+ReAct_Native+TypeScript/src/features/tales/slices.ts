import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Tale {
  id: number
  inDev: string
  imageUrl: string
  name: string
  author: string
}

interface TalesState { 
  dataSheet: string
  dataTale: Tale[]
  loading: boolean
  error: string | null
}

const talesInitial: TalesState = {
  dataSheet: 'Сказки', 
  dataTale: [],
  loading: false, 
  error: null
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
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; state.loading = false },
  },
})