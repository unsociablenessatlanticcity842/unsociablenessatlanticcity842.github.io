'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  shouldShowConsentBanner, 
  acceptAllConsent, 
  // rejectAllConsent,
  updateConsent,
  loadConsentState,
  getConsentMessage,
  getConsentTypeDescriptions,
} from '@/lib/analytics/consent'

interface CookieConsentProps {
  locale?: string
  privacyPolicyUrl?: string
}

export function CookieConsent({ 
  locale = 'ko',
  privacyPolicyUrl = '/privacy-policy'
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consentChoices, setConsentChoices] = useState({
    analytics: false,
    functional: false,
    marketing: false,
  })

  const messages = getConsentMessage(locale)
  const descriptions = getConsentTypeDescriptions(locale)

  useEffect(() => {
    // Check if banner should be shown
    const shouldShow = shouldShowConsentBanner()
    setShowBanner(shouldShow)

    // Load current consent state
    if (shouldShow) {
      const state = loadConsentState()
      setConsentChoices({
        analytics: state.analytics,
        functional: state.functional,
        marketing: state.marketing,
      })
    }
  }, [])

  const handleAcceptAll = () => {
    acceptAllConsent()
    setShowBanner(false)
  }

  // const handleRejectAll = () => {
  //   rejectAllConsent()
  //   setShowBanner(false)
  // }

  const handleSavePreferences = () => {
    // Update each consent type
    Object.entries(consentChoices).forEach(([type, value]) => {
      updateConsent(type as keyof typeof consentChoices, value)
    })
    setShowBanner(false)
  }

  const handleToggleConsent = (type: keyof typeof consentChoices) => {
    setConsentChoices(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDetails(false)
    }
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe"
        role="dialog"
        aria-label={messages.title}
        aria-describedby="consent-description"
        onKeyDown={handleKeyDown}
      >
        <div className="mx-auto max-w-7xl">
          <div className="bg-background border rounded-lg shadow-lg p-6">
            {!showDetails ? (
              // Simple Banner
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 flex items-start gap-3">
                  <Cookie className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{messages.title}</h2>
                    <p id="consent-description" className="text-sm text-muted-foreground">
                      {messages.description}
                    </p>
                    <a 
                      href={privacyPolicyUrl}
                      className="text-sm text-primary hover:underline mt-1 inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {messages.privacyPolicy}
                    </a>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="order-3 sm:order-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {messages.customize}
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    className="order-2"
                  >
                    {messages.rejectAll}
                  </Button> */}
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="order-1 sm:order-3"
                  >
                    {messages.acceptAll}
                  </Button>
                </div>
              </div>
            ) : (
              // Detailed Settings
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{messages.customize}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(false)}
                    aria-label="Close settings"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Essential Cookies - Always On */}
                  <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{descriptions.essential.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {descriptions.essential.description}
                      </p>
                    </div>
                    <Switch
                      checked={true}
                      disabled
                      aria-label={descriptions.essential.name}
                      className="mt-1"
                    />
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{descriptions.analytics.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {descriptions.analytics.description}
                      </p>
                    </div>
                    <Switch
                      checked={consentChoices.analytics}
                      onCheckedChange={() => handleToggleConsent('analytics')}
                      aria-label={descriptions.analytics.name}
                      className="mt-1"
                    />
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{descriptions.functional.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {descriptions.functional.description}
                      </p>
                    </div>
                    <Switch
                      checked={consentChoices.functional}
                      onCheckedChange={() => handleToggleConsent('functional')}
                      aria-label={descriptions.functional.name}
                      className="mt-1"
                    />
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Cookie className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{descriptions.marketing.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {descriptions.marketing.description}
                      </p>
                    </div>
                    <Switch
                      checked={consentChoices.marketing}
                      onCheckedChange={() => handleToggleConsent('marketing')}
                      aria-label={descriptions.marketing.name}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    className="sm:mr-auto"
                  >
                    {messages.rejectAll}
                  </Button> */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAcceptAll}
                    >
                      {messages.acceptAll}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                    >
                      {messages.save}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Consent Settings Component for Privacy Policy Page
export function ConsentSettings({ locale = 'ko' }: { locale?: string }) {
  const [consentState, setConsentState] = useState({
    analytics: false,
    functional: false,
    marketing: false,
  })

  const descriptions = getConsentTypeDescriptions(locale)

  useEffect(() => {
    const state = loadConsentState()
    setConsentState({
      analytics: state.analytics,
      functional: state.functional,
      marketing: state.marketing,
    })

    // Listen for consent updates
    const handleUpdate = () => {
      const newState = loadConsentState()
      setConsentState({
        analytics: newState.analytics,
        functional: newState.functional,
        marketing: newState.marketing,
      })
    }

    window.addEventListener('consentUpdate', handleUpdate)
    return () => window.removeEventListener('consentUpdate', handleUpdate)
  }, [])

  const handleToggle = (type: keyof typeof consentState) => {
    updateConsent(type, !consentState[type])
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">쿠키 설정 관리</h3>
      
      <div className="space-y-4">
        {/* Essential - Always On */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex-1">
            <h4 className="font-medium">{descriptions.essential.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {descriptions.essential.description}
            </p>
          </div>
          <Switch checked={true} disabled />
        </div>

        {/* Analytics */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex-1">
            <h4 className="font-medium">{descriptions.analytics.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {descriptions.analytics.description}
            </p>
          </div>
          <Switch
            checked={consentState.analytics}
            onCheckedChange={() => handleToggle('analytics')}
          />
        </div>

        {/* Functional */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex-1">
            <h4 className="font-medium">{descriptions.functional.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {descriptions.functional.description}
            </p>
          </div>
          <Switch
            checked={consentState.functional}
            onCheckedChange={() => handleToggle('functional')}
          />
        </div>

        {/* Marketing */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex-1">
            <h4 className="font-medium">{descriptions.marketing.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {descriptions.marketing.description}
            </p>
          </div>
          <Switch
            checked={consentState.marketing}
            onCheckedChange={() => handleToggle('marketing')}
          />
        </div>
      </div>
    </div>
  )
}