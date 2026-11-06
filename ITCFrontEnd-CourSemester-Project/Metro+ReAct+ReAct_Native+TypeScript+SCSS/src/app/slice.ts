import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { BoardState, BleStatus } from '@/shared/bluetooth/types'

const bleInitial: BoardState = {
  status: 'idle',
  battery: null,
  progress: 0,
  duration: 0,
  isPlaying: false,
};

const bleSlice = createSlice({
  name: 'ble',
  initialState: bleInitial,
  reducers: {
    patchBoardState(state, action: PayloadAction<Partial<BoardState>>) {
      Object.assign(state, action.payload);
    },
    setStatus(state, action: PayloadAction<BleStatus>) {
      state.status = action.payload;
    },
    setBattery(state, action: PayloadAction<number | null>) {
      state.battery = action.payload;
    },
    resetBoard(state) {
      Object.assign(state, bleInitial);
    },
  },
});

export const { patchBoardState, setStatus, setBattery, resetBoard } = bleSlice.actions;

export interface Tale {
  id: number;
  imageUrl: string;
  name: string;
  author: string;
}

interface TalesState {
  dataSheet: string;
  dataTale: Tale[];
  loading: boolean;
  error: string | null;
}

const talesInitial: TalesState = {
  dataSheet: 'Сказки',
  dataTale: [],
  loading: false,
  error: null,
};

const talesSlice = createSlice({
  name: 'tales',
  initialState: talesInitial,
  reducers: {
    setTales(state, action: PayloadAction<{ dataSheet: string; dataTale: Tale[] }>) {
      state.dataSheet = action.payload.dataSheet;
      state.dataTale = action.payload.dataTale;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setTales, setLoading, setError } = talesSlice.actions;

export const SLICES = {
  ble: bleSlice.reducer,
  tales: talesSlice.reducer,
} as const;

export const rootReducer = combineReducers(SLICES);