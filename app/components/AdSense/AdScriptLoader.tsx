'use client'

import { useEffect } from 'react'
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig'

interface AdScriptLoaderProps {
  enableAutoAds: boolean
}

declare global {
  interface Window {
    __adScriptLoaded?: boolean
  }
}

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7494322760704385'

export default function AdScriptLoader({ enableAutoAds }: AdScriptLoaderProps) {
  const shouldLoad = SHOW_MANUAL_ADS || enableAutoAds

  useEffect(() => {
    if (!shouldLoad) return

    const queueAutoAds = () => {
      if (!enableAutoAds) return
      try {
        const adsQueue = window.adsbygoogle || []
        adsQueue.push({
          google_ad_client: 'ca-pub-7494322760704385',
          enable_page_level_ads: true,
        })
        window.adsbygoogle = adsQueue
      } catch (error) {
        console.warn('AdSense auto ads failed to initialize', error)
      }
    }

    const loadScript = () => {
      if (window.__adScriptLoaded) {
        queueAutoAds()
        return
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-adsbygoogle="true"]')
      if (existing) {
        window.__adScriptLoaded = true
        queueAutoAds()
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src = ADSENSE_SRC
      script.crossOrigin = 'anonymous'
      script.setAttribute('data-adsbygoogle', 'true')
      script.onload = () => {
        window.__adScriptLoaded = true
        queueAutoAds()
      }
      document.head.appendChild(script)
    }

    const scheduleLoad = () => {
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

