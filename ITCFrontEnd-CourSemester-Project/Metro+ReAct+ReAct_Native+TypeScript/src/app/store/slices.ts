import { combineReducers } from '@reduxjs/toolkit'
import { bleSlice } from '@/features/ble'
import { talesSlice } from '@/features/tales'

export const slices = {
  ble: bleSlice.reducer,
  tales: talesSlice.reducer,
} as const

export const rootReducer = combineReducers(slices)