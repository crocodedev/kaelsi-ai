"use client"

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { PropsWithChildren } from 'react'


export function I18nProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
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