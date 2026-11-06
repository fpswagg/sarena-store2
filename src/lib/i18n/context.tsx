'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type Locale, translations, type Translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && (saved === 'fr' || saved === 'en')) {
      // Initialize locale from localStorage on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocale(saved)
      document.documentElement.lang = saved
    } else {
      const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en'
      // Initialize locale from browser on mount
      setLocale(browserLang)
      document.documentElement.lang = browserLang
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
