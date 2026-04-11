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

    let cancelled = false

    const queueAutoAds = () => {
      if (!enableAutoAds || window.__pageLevelAdsQueued || cancelled) return
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
      if (cancelled) return
      window.dispatchEvent(new Event(ADSENSE_SCRIPT_LOADED_EVENT))
    }

    /** Page-level auto ads compete with the adsbygoogle queue; run after manual slot pushes have been scheduled. */
    const scheduleAutoAdsAfterManual = () => {
      if (!enableAutoAds || cancelled) return
      if (SHOW_MANUAL_ADS) {
        setTimeout(() => queueAutoAds(), 250)
      } else {
        queueAutoAds()
      }
    }

    const markScriptReady = () => {
      if (cancelled || window.__adScriptLoaded) return
      window.__adScriptLoaded = true
      notifyManualSlots()
      scheduleAutoAdsAfterManual()
    }

    const loadScript = () => {
      if (window.__adScriptLoaded) {
        // Script already injected (e.g. strict mode / remount); only auto-ads may need a first queue.
        scheduleAutoAdsAfterManual()
        return
      }

      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-fb-adsense-script="true"], script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      )
      if (existing) {
        if ((existing as HTMLScriptElement & { dataset: DOMStringMap }).dataset.fbAdsenseReady === 'true') {
          markScriptReady()
          return
        }

        existing.addEventListener('load', markScriptReady, { once: true })
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src = ADSENSE_SRC
      script.crossOrigin = 'anonymous'
      script.setAttribute('data-fb-adsense-script', 'true')
      script.onload = () => {
        script.dataset.fbAdsenseReady = 'true'
        markScriptReady()
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
      return () => {
        cancelled = true
        window.removeEventListener('load', scheduleLoad)
      }
    }

    return () => {
      cancelled = true
    }
  }, [enableAutoAds, shouldLoad])

  return null
}
