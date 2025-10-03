"use client"

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { PropsWithChildren } from 'react'
import { Device } from "@capacitor/device"
import { astroActions, useAppDispatch, useAppSelector, userActions } from '@/store'
import { LocalStorage } from '@/lib/utils/localStorage'

function normalizeLang(code?: string): string {
  if (!code) return 'en'
  const short = code.split('-')[0].toLowerCase()
  const allowed = ['en', 'ru', 'uk']
  return allowed.includes(short) ? short : 'en'
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false)
  const storedLanguage = LocalStorage.getLanguage()
  const languages = useAppSelector(state => state.astro.languages)
  const languageUser = useAppSelector(state => state.user.preferences.language);

  const dispatch = useAppDispatch()

  const ensureLanguage = async () => {
    if (storedLanguage) {
      const norm = normalizeLang(storedLanguage)
      if (i18n.language !== norm) {
        await i18n.changeLanguage(norm)
      }
      if (languageUser !== norm) {
        dispatch(userActions.setLanguage(norm as any))
      }
      return
    }

    const { value } = await Device.getLanguageCode();
    const deviceCode = normalizeLang(value)

    if (!languages || languages.length === 0) {
      await dispatch(astroActions.getLanguages())
    }

    await i18n.changeLanguage(deviceCode)
    dispatch(userActions.setLanguage(deviceCode as any))
    LocalStorage.setItem(LocalStorage.LANGUAGE_KEY, deviceCode)
  }

  useEffect(() => {
    if (!languageUser) return
    const norm = normalizeLang(languageUser)
    if (i18n.language !== norm) {
      i18n.changeLanguage(norm)
    }
    if (LocalStorage.getLanguage() !== norm) {
      LocalStorage.setItem(LocalStorage.LANGUAGE_KEY, norm)
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