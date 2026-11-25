import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { talesSlice } from '@/features/tales'
import type { BoardState, BleStatus } from '@/entities/board'

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

export const slices = {
  ble: bleSlice.reducer,
  tales: talesSlice.reducer,
} as const

export const rootReducer = combineReducers(slices)