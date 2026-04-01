'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Global smooth scrolling for mouse wheel & touchpad (Lenis).
 * Exposes the instance on window.__lenis so anchor navigation can use it.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    ;(window as any).__lenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      ;(window as any).__lenis = null
    }
  }, [])

  return <>{children}</>
}
