"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  readOnly?: boolean
  className?: string
}

export default function RatingStars({ value, onChange, size = 20, readOnly = false, className = "" }: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null)
  const stars = [1,2,3,4,5]

  const display = hover ?? value

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${display} out of 5`}>
      {stars.map((i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(i)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => !readOnly && onChange && onChange(i)}
          className={`p-0.5 rounded ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          aria-pressed={i <= value}
        >
          <Star
            className={`${i <= display ? 'text-yellow-400 fill-current' : 'text-white/40'} transition-colors`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  )
}
