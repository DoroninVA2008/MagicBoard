export { store } from '@/app/store/store'
export * from '@/app/store/selectors'
export type { RootStackParamList, RootState, AppDispatch, SliceName } from '@/app/store/types'
export { useBle, patchBoardState, setStatus, setBattery, resetBoard } from '@/features/ble'