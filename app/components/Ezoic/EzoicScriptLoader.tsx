import Script from 'next/script';
import { ENABLE_EZOIC } from '../../lib/adsConfig';

const EZOIC_CMP_SRC = 'https://the.gatekeeperconsent.com/cmp.min.js';
const EZOIC_SA_SRC = 'https://www.ezojs.com/ezoic/sa.min.js';

export default function EzoicScriptLoader() {
  if (!ENABLE_EZOIC) return null;

  return (
    <>
      <Script id="ezoic-init" strategy="beforeInteractive">
        {`
          window.ezstandalone = window.ezstandalone || {};
          window.ezstandalone.cmd = window.ezstandalone.cmd || [];
        `}
      </Script>
      <Script
        id="ezoic-cmp"
        src={EZOIC_CMP_SRC}
        strategy="beforeInteractive"
        data-cfasync="false"
        crossOrigin="anonymous"
      />
      <Script
        id="ezoic-sa"
        src={EZOIC_SA_SRC}
        strategy="afterInteractive"
        data-cfasync="false"
        crossOrigin="anonymous"
      />
    </>
  );
}
