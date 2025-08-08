import { useTranslation as useI18nTranslation } from 'react-i18next'

export const useTranslation = () => {
  try {
    const { t, i18n } = useI18nTranslation()

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng)
    }

    const currentLanguage = i18n.language

    return {
      t,
      changeLanguage,
      currentLanguage,
      isReady: i18n.isInitialized
    }
  } catch (error) {
    // Fallback for server-side rendering
    return {
      t: (key: string) => key,
      changeLanguage: () => {},
      currentLanguage: 'en',
      isReady: false
    }
  }
} 