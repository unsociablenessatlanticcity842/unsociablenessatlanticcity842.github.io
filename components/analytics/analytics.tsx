'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Simplified Google Analytics Component
 *
 * Uses Next.js official @next/third-parties package
 * No consent management - simple personal blog analytics
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GA4] Measurement ID not configured')
    }
    return null
  }

  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
