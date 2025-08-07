'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_MEASUREMENT_ID, GA_SCRIPT_URL, RESOURCE_HINTS } from '@/lib/analytics/constants'
import { initializeDataLayer, initializeGA4, trackPageView } from '@/lib/analytics/gtag'
import { hasAnalyticsConsent, initializeConsent } from '@/lib/analytics/consent'
import { trackPageTiming } from '@/lib/analytics/events'

interface GoogleAnalyticsProps {
  nonce?: string
}

export function GoogleAnalytics({ nonce }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isConsentGiven, setIsConsentGiven] = useState(false)

  // Initialize consent system and check consent status
  useEffect(() => {
    initializeConsent()
    setIsConsentGiven(hasAnalyticsConsent())

    // Listen for consent changes
    const handleConsentUpdate = () => {
      setIsConsentGiven(hasAnalyticsConsent())
    }

    window.addEventListener('consentUpdate', handleConsentUpdate)
    return () => window.removeEventListener('consentUpdate', handleConsentUpdate)
  }, [])

  // Initialize GA4 when consent is given
  useEffect(() => {
    if (isConsentGiven && GA_MEASUREMENT_ID) {
      initializeDataLayer()
      
      // Track initial page timing
      if (document.readyState === 'complete') {
        trackPageTiming()
      } else {
        window.addEventListener('load', trackPageTiming, { once: true })
      }
    }
  }, [isConsentGiven])

  // Track page views on route changes
  useEffect(() => {
    if (isConsentGiven && GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams, isConsentGiven])

  // Add resource hints for performance
  useEffect(() => {
    if (!isConsentGiven || !GA_MEASUREMENT_ID) return

    const head = document.head
    const existingHints = new Set(
      Array.from(head.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]'))
        .map(link => link.getAttribute('href'))
    )

    RESOURCE_HINTS.forEach(hint => {
      if (!existingHints.has(hint.href)) {
        const link = document.createElement('link')
        link.rel = hint.rel
        link.href = hint.href
        if (hint.rel === 'preconnect') {
          link.crossOrigin = 'anonymous'
        }
        head.appendChild(link)
      }
    })
  }, [isConsentGiven])

  // Don't render scripts if no consent or no measurement ID
  if (!isConsentGiven || !GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={GA_SCRIPT_URL}
        strategy="afterInteractive"
        nonce={nonce}
        onLoad={() => {
          // Initialize GA4 after script loads
          initializeGA4()
        }}
        onError={(e) => {
          console.error('Failed to load Google Analytics:', e)
        }}
      />
      
      {/* Inline initialization script */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  )
}