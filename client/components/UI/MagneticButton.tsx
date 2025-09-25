"use client"

import { useRef } from "react"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intensity?: number // pixels of translate at edges
  href?: string
}

export default function MagneticButton({ intensity = 12, className = "", children, href, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tx = (x - 0.5) * 2 * intensity
    const ty = (y - 0.5) * 2 * intensity
    el.style.transform = `translate(${tx}px, ${ty}px)`
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "translate(0,0)"
  }

  if (href) {
    return (
      <a
        href={href}
        onMouseMove={onMove as any}
        onMouseLeave={reset as any}
        className={`magnetic-btn inline-block ${className}`}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`magnetic-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
