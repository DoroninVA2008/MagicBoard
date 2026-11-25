import React, { type FC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store/types'
import { TALES_RESPONSE } from '../../../mocks/db'
import { setTales } from '@/features/tales/slices'
import { selectTalesState } from '@/features/tales/selectors'

export const useTale: React.FC = () => {
  const { dataSheet, dataTale, loading, error } = useSelector(selectTalesState)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      setTales({
        dataSheet: TALES_RESPONSE.header.forName,
        dataTale: TALES_RESPONSE.tales,
      }),
    )
  }, [dispatch])

  return { dataSheet, dataTale, loading, error }
}