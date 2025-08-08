import { store } from '@/store'
import { astroActions, tarotActions } from '@/store'

export const prefetchEssentialData = async () => {
  try {
    await Promise.allSettled([
      store.dispatch(astroActions.getLanguages()),
      store.dispatch(astroActions.getPlans()),
      store.dispatch(tarotActions.getTarotCategories())
    ])
  } catch (error) {
    console.error('Error prefetching data:', error)
  }
}

export const prefetchUserData = async () => {
  try {
    await store.dispatch(astroActions.getCardDay())
  } catch (error) {
    console.error('Error prefetching user data:', error)
  }
} 