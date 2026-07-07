import Script from 'next/script'

/**
 * Google Analytics 4 (gtag.js).
 *
 * The measurement ID is read from NEXT_PUBLIC_GA_ID, which is inlined at build
 * time (see Dockerfile.frontend / deploy.yml build-args and .env.production).
 * When the ID is absent (e.g. local dev without the var set) this renders
 * nothing, so no tracking runs off production.
 *
 * `afterInteractive` loads the tag after the page is interactive — the
 * recommended strategy for analytics so it never blocks first paint. GA4's
 * enhanced measurement handles SPA route-change pageviews automatically.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
