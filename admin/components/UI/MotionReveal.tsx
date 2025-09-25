"use client"

import { useEffect, useRef, useState } from "react"

interface MotionRevealProps {
  children: React.ReactNode
  className?: string
  once?: boolean
  threshold?: number
  delayMs?: number
}

export default function MotionReveal({ children, className = "", once = true, threshold = 0.2, delayMs = 0 }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delayMs)
          if (once) obs.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once, threshold, delayMs])

  return (
    <div ref={ref} className={`${className} ${visible ? 'reveal-up' : 'reveal-init'}`}>
      {children}
    </div>
  )
}
