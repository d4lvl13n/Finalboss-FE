'use client'

import { useEffect } from 'react'
import { ADSENSE_SCRIPT_LOADED_EVENT, SHOW_MANUAL_ADS } from '../../lib/adsConfig'
import siteConfig, { adsenseSrc } from '../../lib/siteConfig'

interface AdScriptLoaderProps {
  enableAutoAds: boolean
}

declare global {
  interface Window {
    __adScriptLoaded?: boolean
  }
}

const ADSENSE_SRC = adsenseSrc

export default function AdScriptLoader({ enableAutoAds }: AdScriptLoaderProps) {
  const shouldLoad = SHOW_MANUAL_ADS || enableAutoAds

  useEffect(() => {
    if (!shouldLoad) return

    const queueAutoAds = () => {
      if (!enableAutoAds || window.__pageLevelAdsQueued) return
      try {
        window.__pageLevelAdsQueued = true
        const adsQueue = window.adsbygoogle || []
        adsQueue.push({
          google_ad_client: siteConfig.adsensePublisherId,
          enable_page_level_ads: true,
        })
        window.adsbygoogle = adsQueue
      } catch (error) {
        window.__pageLevelAdsQueued = false
        console.warn('AdSense auto ads failed to initialize', error)
      }
    }

    const notifyManualSlots = () => {
      window.dispatchEvent(new Event(ADSENSE_SCRIPT_LOADED_EVENT))
    }

    /** Page-level auto ads compete with the adsbygoogle queue; run after manual slot pushes have been scheduled. */
    const scheduleAutoAdsAfterManual = () => {
      if (!enableAutoAds) return
      if (SHOW_MANUAL_ADS) {
        setTimeout(() => queueAutoAds(), 250)
      } else {
        queueAutoAds()
      }
    }

    const loadScript = () => {
      if (window.__adScriptLoaded) {
        // Script already injected (e.g. strict mode / remount); only auto-ads may need a first queue.
        scheduleAutoAdsAfterManual()
        return
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-adsbygoogle="true"]')
      if (existing) {
        window.__adScriptLoaded = true
        notifyManualSlots()
        scheduleAutoAdsAfterManual()
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src = ADSENSE_SRC
      script.crossOrigin = 'anonymous'
      script.setAttribute('data-adsbygoogle', 'true')
      script.onload = () => {
        window.__adScriptLoaded = true
        notifyManualSlots()
        scheduleAutoAdsAfterManual()
      }
      document.head.appendChild(script)
    }

    // Manual units need adsbygoogle.js ASAP; requestIdleCallback was delaying fills and left empty slots.
    const scheduleLoad = () => {
      if (SHOW_MANUAL_ADS) {
        if (document.readyState === 'complete') {
          loadScript()
        } else {
          window.addEventListener('load', loadScript, { once: true })
        }
        return
      }
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => loadScript())
      } else {
        setTimeout(loadScript, 1500)
      }
    }

    if (document.readyState === 'complete') {
      scheduleLoad()
    } else {
      window.addEventListener('load', scheduleLoad, { once: true })
      return () => window.removeEventListener('load', scheduleLoad)
    }
  }, [enableAutoAds, shouldLoad])

  return null
}

