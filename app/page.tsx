"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useAstro } from "@/hooks/useAstro"
import { useTranslation } from "@/hooks/useTranslation"
import { CardOfTheDay } from "@/components/sections/home-page/card-of-the-day"
import { Explore } from "@/components/sections/home-page/explore"
import { History } from "@/components/sections/home-page/history"
import { Main } from "@/components/main"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const { isAuthenticated, getUser } = useAuth()
  const { getCardDay, getLanguages, getPlans } = useAstro()
  const { t } = useTranslation()

  useEffect(() => {
    const loadInitialData = async () => {
      try {

        if (isAuthenticated) {
          await Promise.allSettled([
            getUser(),
            getCardDay(),
            getLanguages(),
            getPlans()
          ])
        }

        setIsLoaded(true)

      } catch (error) {
        console.error('Error loading initial data:', error)
        setHasError(true)
      }
    }

    if (!isLoaded) {
      loadInitialData()
    }
  }, [isAuthenticated, getUser, getLanguages, getPlans, getCardDay, isLoaded])

  if (hasError) {
    return (
      <div className="min-h-screen bg-mystical-bg text-mystical-text flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cormorant font-semibold mb-4">{t('common.somethingWentWrong')}</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-mystical-accent text-mystical-bg rounded-lg hover:bg-mystical-gold transition-colors"
          >
            {t('common.reloadPage')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <Main>
      <CardOfTheDay />
      <Explore />
      <History />
    </Main>
  )
}
