'use client'

import Script from 'next/script'

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

/**
 * Google AdSense Script Component
 *
 * Loads the AdSense script globally. Individual ad units are placed
 * using the AdUnit component.
 */
export function GoogleAdSense() {
  if (!ADSENSE_CLIENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AdSense] Client ID not configured')
    }
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  layout?: string
  className?: string
  responsive?: boolean
}

/**
 * Individual AdSense Ad Unit
 *
 * Place this component where you want an ad to appear.
 * Each ad unit needs a unique slot ID from the AdSense dashboard.
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  className = '',
  responsive = true,
}: AdUnitProps) {
  if (!ADSENSE_CLIENT_ID) {
    return (
      <div
        className={`${className} flex items-center justify-center border border-dashed border-muted-foreground/30 rounded-lg bg-muted/20 text-muted-foreground text-xs py-6`}
      >
        광고 영역 (AdSense 미설정)
      </div>
    )
  }

  return (
    <div className={className} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout && { 'data-ad-layout': layout })}
        {...(responsive && { 'data-full-width-responsive': 'true' })}
      />
      <Script id={`adsense-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  )
}
