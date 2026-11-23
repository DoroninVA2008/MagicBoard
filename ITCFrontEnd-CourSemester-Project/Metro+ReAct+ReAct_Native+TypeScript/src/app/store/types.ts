import { rootReducer, slices } from '@/app/store/slices'
import { store } from '@/app/store/store'

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type SliceName = keyof typeof slices
export type RootStackParamList = {
  HomeScreen: undefined,
  ManagementScreen: {
    id: number
    inDev: string
    imageUrl: string
    name: string 
    author: string
  },
  TaleScreen: {
    id: number
    inDev: string
    imageUrl: string
    name: string
    author: string
  },
};