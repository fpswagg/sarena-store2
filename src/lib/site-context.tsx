'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteInfo } from './types'

const SiteContext = createContext<SiteInfo | null>(null)

export function SiteProvider({ info, children }: { info: SiteInfo; children: ReactNode }) {
  return <SiteContext.Provider value={info}>{children}</SiteContext.Provider>
}

/** Business details from SSS (name, WhatsApp, city…). */
export function useSite(): SiteInfo {
  const info = useContext(SiteContext)
  if (!info) throw new Error('useSite must be used within SiteProvider')
  return info
}
