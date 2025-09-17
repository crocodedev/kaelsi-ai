"use client"

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { PropsWithChildren } from 'react'
import { Device } from "@capacitor/device"
import { astroActions, useAppDispatch, useAppSelector, userActions } from '@/store'
import { LocalStorage } from '@/lib/utils/localStorage'

export function I18nProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false)
  const storedLanguage = LocalStorage.getLanguage()
  const languages = useAppSelector(state => state.astro.languages)
  const languageUser = useAppSelector(state => state.user.preferences.language);

  const dispatch = useAppDispatch()

  const ensureLanguage = async () => {
    if (storedLanguage) {
      if (i18n.language !== storedLanguage) {
        await i18n.changeLanguage(storedLanguage)
      }
      if (languageUser !== storedLanguage) {
        dispatch(userActions.setLanguage(storedLanguage as any))
      }
      return
    }

    const { value } = await Device.getLanguageCode();

    if (!languages || languages.length === 0) {
      await dispatch(astroActions.getLanguages())
    }

    const allowed = ['en', 'ru', 'uk']
    const deviceCode = (value || '').split('-')[0]
    const targetCode = allowed.includes(deviceCode) ? deviceCode : 'en'

    await i18n.changeLanguage(targetCode)
    dispatch(userActions.setLanguage(targetCode as any))
    LocalStorage.setItem(LocalStorage.LANGUAGE_KEY, targetCode)
  }

  useEffect(() => {
    if (!languageUser) return
    if (i18n.language !== languageUser) {
      i18n.changeLanguage(languageUser)
    }
    if (LocalStorage.getLanguage() !== languageUser) {
      LocalStorage.setItem(LocalStorage.LANGUAGE_KEY, languageUser)
    }
  }, [languageUser])

  useEffect(() => {
    setIsClient(true)
    ensureLanguage()
  }, [])

  if (!isClient) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
} 