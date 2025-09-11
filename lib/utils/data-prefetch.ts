import { authActions, store } from '@/store'
import { astroActions } from '@/store'

export const prefetchEssentialData = async () => {
  try {
    await Promise.allSettled([
      store.dispatch(authActions.getUser()),
      store.dispatch(astroActions.getLanguages()),
      store.dispatch(astroActions.getPlans()),
    ])
  } catch (error) {
    console.error('Error prefetching data:', error)
  }
}