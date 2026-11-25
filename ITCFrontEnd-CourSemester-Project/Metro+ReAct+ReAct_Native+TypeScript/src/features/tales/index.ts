export type { Tale, TaleHeader, TalesResponse, TalesState } from '@/features/tales/types'
export * from '@/features/tales/selectors'
export { talesSlice, setTales, setLoading, setError } from '@/features/tales/slices'
export { useTale } from '@/features/tales/sagas'

export const TalesFeature = {
    
}