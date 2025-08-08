import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { AppDispatch, AppState } from '@/store'
import { tarotActions } from '@/store'
import { TarotReadingRequest } from '@/lib/types/astro-api'

export const useTarot = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    categories, 
    cards, 
    readings, 
    currentReading, 
    loading, 
    error, 
    pagination 
  } = useSelector((state: AppState) => state.tarot)

  const handleGetCategories = useCallback(async () => {
    return await dispatch(tarotActions.getTarotCategories())
  }, [dispatch])

  const handleGetCards = useCallback(async () => {
    return await dispatch(tarotActions.getTarotCards())
  }, [dispatch])

  const handleCreateReading = useCallback(
    async (data: TarotReadingRequest) => {
      return await dispatch(tarotActions.createTarotReading(data))
    },
    [dispatch]
  )

  const handleGetReadings = useCallback(async () => {
    return await dispatch(tarotActions.getTarotReadings())
  }, [dispatch])

  const handleGetReading = useCallback(
    async (tarotUser: string) => {
      return await dispatch(tarotActions.getTarotReading(tarotUser))
    },
    [dispatch]
  )

  const handleClearError = useCallback(() => {
    dispatch(tarotActions.clearError())
  }, [dispatch])

  const handleClearCurrentReading = useCallback(() => {
    dispatch(tarotActions.clearCurrentReading())
  }, [dispatch])

  const handleSetCurrentReading = useCallback(
    (reading: any) => {
      dispatch(tarotActions.setCurrentReading(reading))
    },
    [dispatch]
  )

  return {
    categories,
    cards,
    readings,
    currentReading,
    loading,
    error,
    pagination,
    getCategories: handleGetCategories,
    getCards: handleGetCards,
    createReading: handleCreateReading,
    getReadings: handleGetReadings,
    getReading: handleGetReading,
    clearError: handleClearError,
    clearCurrentReading: handleClearCurrentReading,
    setCurrentReading: handleSetCurrentReading
  }
} 