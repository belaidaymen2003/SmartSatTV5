"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  children: React.ReactNode
  itemWidthPx?: number
  autoPlayMs?: number
}

export default function Carousel({ children, itemWidthPx = 240, autoPlayMs = 3500 }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let timer: any
    const tick = () => {
      if (!containerRef.current) return
      if (document.hidden || isHovering) return
      containerRef.current.scrollBy({ left: itemWidthPx, behavior: 'smooth' })
      // loop back when reaching end
      if (Math.ceil(containerRef.current.scrollLeft + containerRef.current.clientWidth) >= containerRef.current.scrollWidth) {
        setTimeout(() => containerRef.current && (containerRef.current.scrollLeft = 0), 400)
      }
    }

    timer = setInterval(tick, autoPlayMs)
    return () => clearInterval(timer)
  }, [itemWidthPx, autoPlayMs, isHovering])

  const scroll = (dir: -1 | 1) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: dir * itemWidthPx, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="overflow-x-auto no-scrollbar pr-2 -mr-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-4 w-max">
          {Array.isArray(children)
            ? children.map((child, i) => (
                <div key={i} style={{ minWidth: itemWidthPx, scrollSnapAlign: 'start' }}>
                  {child}
                </div>
              ))
            : <div style={{ minWidth: itemWidthPx, scrollSnapAlign: 'start' }}>{children}</div>}
        </div>
      </div>
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
