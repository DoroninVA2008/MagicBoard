import { configureStore, combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'react-native'
import { bleService } from '@/shared/bluetooth/ble'
import type { BoardState, BleStatus } from '@/shared/bluetooth/types'

const bleInitial: BoardState = {
  status: 'idle',
  battery: null,
  progress: 0,
  duration: 0,
  isPlaying: false,
}

const bleSlice = createSlice({
  name: 'ble',
  initialState: bleInitial,
  reducers: {
    patchBoardState(state, action: PayloadAction<Partial<BoardState>>) {
      Object.assign(state, action.payload)
    },
    setStatus(state, action: PayloadAction<BleStatus>) {
      state.status = action.payload
    },
    setBattery(state, action: PayloadAction<number | null>) {
      state.battery = action.payload
    },
    resetBoard(state) {
      Object.assign(state, bleInitial)
    },
  },
})

export const { patchBoardState, setStatus, setBattery, resetBoard } = bleSlice.actions

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
  error: null,
}

const talesSlice = createSlice({
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

export const SLICES = {
  ble: bleSlice.reducer,
  tales: talesSlice.reducer,
} as const

export const rootReducer = combineReducers(SLICES)

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type SliceName = keyof typeof SLICES

export const useBle = () => {
  const state = useSelector((s: RootState) => s.ble)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const unsub = bleService.subscribe((patch) => {
      dispatch(patchBoardState(patch))
    })
    const sub = AppState.addEventListener('change', (a) => {
      if (a === 'active') bleService.onAppResume()
    })
    return () => {
      unsub()
      sub.remove()
    }
  }, [dispatch])

  const sendCommand = useCallback((cmd: string) => {
    if (cmd === 'START' || cmd === 'PAUSE') bleService.send(cmd)
  }, [])

  const seek = useCallback((ms: number) => bleService.seek(ms), [])

  return { ...state, sendCommand, seek }
}