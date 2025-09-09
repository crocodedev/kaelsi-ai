"use client"

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { PropsWithChildren } from 'react'
import { Device } from "@capacitor/device"
import { astroActions, useAppDispatch, useAppSelector, userActions } from '@/store'
import { Language } from '@/lib/types/astro-api'
import { LocalStorage } from '@/lib/utils/localStorage'


export function I18nProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false)
  const storedLanguage = LocalStorage.getLanguage()
  const languages = useAppSelector(state => state.astro.languages)
  const languageUser = useAppSelector(state => state.user.preferences.language);
  const dispatch = useAppDispatch()

  const getLanguageCode = async () => {
    if (languageUser !== storedLanguage) {
      dispatch(userActions.setLanguage(storedLanguage));
    }

    if (storedLanguage) return;

    const { value } = await Device.getLanguageCode();

    if (languages.length > 0) {
      await dispatch(astroActions.getLanguages())
    };

    const language: Language = languages.find((language: Language) => language.code === value) || languages[0];

    i18n.changeLanguage(language.code)
    dispatch(userActions.setLanguage(language))
  }


  useEffect(() => {
    setIsClient(true)

    getLanguageCode()
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