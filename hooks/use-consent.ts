'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  loadConsentState,
  updateConsent as updateConsentState,
  acceptAllConsent,
  rejectAllConsent,
  resetConsent as resetConsentState,
  hasAnalyticsConsent,
  hasMarketingConsent,
  hasFunctionalConsent,
  hasAnyConsent,
  shouldShowConsentBanner,
} from '@/lib/analytics/consent'
import type { ConsentState } from '@/lib/analytics/types'

export function useConsent() {
  const [consentState, setConsentState] = useState<ConsentState>(() => loadConsentState())
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Initial check
    setShowBanner(shouldShowConsentBanner())

    // Listen for consent updates
    const handleConsentUpdate = () => {
      setConsentState(loadConsentState())
      setShowBanner(shouldShowConsentBanner())
    }

    window.addEventListener('consentUpdate', handleConsentUpdate)
    return () => window.removeEventListener('consentUpdate', handleConsentUpdate)
  }, [])

  const updateConsent = useCallback((
    type: keyof Omit<ConsentState, 'timestamp' | 'version'>,
    value: boolean
  ) => {
    updateConsentState(type, value)
  }, [])

  const acceptAll = useCallback(() => {
    acceptAllConsent()
  }, [])

  const rejectAll = useCallback(() => {
    rejectAllConsent()
  }, [])

  const resetConsent = useCallback(() => {
    resetConsentState()
  }, [])

  return {
    // State
    consentState,
    showBanner,
    
    // Consent status
    hasAnalyticsConsent: hasAnalyticsConsent(),
    hasMarketingConsent: hasMarketingConsent(),
    hasFunctionalConsent: hasFunctionalConsent(),
    hasAnyConsent: hasAnyConsent(),
    
    // Actions
    updateConsent,
    acceptAll,
    rejectAll,
    resetConsent,
  }
}