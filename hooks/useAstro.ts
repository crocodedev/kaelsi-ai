import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { AppDispatch, AppState } from '@/store'
import { astroActions } from '@/store'
import { NatalChartData, FateMatrixData } from '@/lib/types/astro-api'

export const useAstro = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    natalChart, 
    fateMatrix, 
    cardDay, 
    languages, 
    plans, 
    loading, 
    error 
  } = useSelector((state: AppState) => state.astro)

  const handleGetLanguages = useCallback(async () => {
    return await dispatch(astroActions.getLanguages())
  }, [dispatch])

  const handleGetPlans = useCallback(async () => {
    return await dispatch(astroActions.getPlans())
  }, [dispatch])

  const handleGetNatalChart = useCallback(async () => {
    return await dispatch(astroActions.getNatalChart())
  }, [dispatch])

  const handleCreateNatalChart = useCallback(
    async (data: NatalChartData) => {
      return await dispatch(astroActions.createNatalChart(data))
    },
    [dispatch]
  )

  const handleGetFateMatrix = useCallback(async () => {
    return await dispatch(astroActions.getFateMatrix())
  }, [dispatch])

  const handleCreateFateMatrix = useCallback(
    async (data: FateMatrixData) => {
      return await dispatch(astroActions.createFateMatrix(data))
    },
    [dispatch]
  )

  const handleGetCardDay = useCallback(async () => {
    return await dispatch(astroActions.getCardDay())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(astroActions.clearError())
  }, [dispatch])

  const handleClearNatalChart = useCallback(() => {
    dispatch(astroActions.clearNatalChart())
  }, [dispatch])

  const handleClearFateMatrix = useCallback(() => {
    dispatch(astroActions.clearFateMatrix())
  }, [dispatch])

  const handleClearCardDay = useCallback(() => {
    dispatch(astroActions.clearCardDay())
  }, [dispatch])

  return {
    natalChart,
    fateMatrix,
    cardDay,
    languages,
    plans,
    loading,
    error,
    getLanguages: handleGetLanguages,
    getPlans: handleGetPlans,
    getNatalChart: handleGetNatalChart,
    createNatalChart: handleCreateNatalChart,
    getFateMatrix: handleGetFateMatrix,
    createFateMatrix: handleCreateFateMatrix,
    getCardDay: handleGetCardDay,
    clearError: handleClearError,
    clearNatalChart: handleClearNatalChart,
    clearFateMatrix: handleClearFateMatrix,
    clearCardDay: handleClearCardDay
  }
} 