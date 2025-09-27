'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Star,
  Play,
  ShoppingCart,
  Coins,
  Film,
  Tv,
  Radio,
  Gamepad2,
  Clock,
  Heart,
  Info
} from 'lucide-react'
import { useEffect } from 'react'

export interface Content {
  id: number
  title: string
  type: 'movie' | 'series' | 'live' | 'gaming'
  price: number
  rating: number
  image: string
  description: string
  duration?: string
  genre: string
  year?: number
  actors?: string[]
  director?: string
  trailer?: string
}

interface ContentCardProps {
  content: Content
  onPurchase: (content: Content) => void
  onViewDetails: (content: Content) => void
  userCredits: number
  isOwned?: boolean
}

export default function ContentCard({
  content,
  onPurchase,
  onViewDetails,
  userCredits,
  isOwned = false
}: ContentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState<number>(0)

  // Initialize favorite state from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('watchlist')
    if (raw) {
      try {
        const ids: number[] = JSON.parse(raw)
        setIsFavorite(ids.includes(content.id))
      } catch {}
    }
    const load = () => {
      const reviewsRaw = localStorage.getItem('reviews')
      if (reviewsRaw) {
        try {
          const all: any[] = JSON.parse(reviewsRaw)
          const list = all.filter(r => r && r.contentId === content.id)
          if (list.length) {
            const avg = list.reduce((s,r)=> s + Number(r.rating || 0), 0) / list.length
            setAvgRating(Number(avg.toFixed(1)))
            setReviewCount(list.length)
          } else {
            setAvgRating(null)
            setReviewCount(0)
          }
        } catch {
          setAvgRating(null); setReviewCount(0)
        }
      } else {
        setAvgRating(null); setReviewCount(0)
      }
    }
    load()
    const onStorage = (e: StorageEvent) => { if (e.key === 'reviews') load() }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [content.id])

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="w-4 h-4" />
      case 'series': return <Tv className="w-4 h-4" />
      case 'live': return <Radio className="w-4 h-4" />
      case 'gaming': return <Gamepad2 className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => {
      const next = !prev
      const raw = localStorage.getItem('watchlist')
      let ids: number[] = []
      if (raw) {
        try { ids = JSON.parse(raw) } catch { ids = [] }
      }
      if (next && !ids.includes(content.id)) ids.push(content.id)
      if (!next) ids = ids.filter((id) => id !== content.id)
      localStorage.setItem('watchlist', JSON.stringify(ids))
      return next
    })
  }

  return (
    <div className="glass rounded-2xl overflow-hidden content-card group" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className="relative h-48 overflow-hidden">
        {/* Image / Trailer preview */}
        {content.trailer && hovering ? (
          <video
            muted
            autoPlay
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={content.trailer}
          />
        ) : (
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
          {getCategoryIcon(content.type)}
          <span className="capitalize">{content.type}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>{avgRating ?? content.rating}</span>
          {reviewCount > 0 ? <span className="text-white/50">({reviewCount})</span> : null}
        </div>

        {/* Year */}
        {content.year && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
            {content.year}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
        </button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={`/content/${content.id}`}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Play className="w-8 h-8 text-white fill-current" />
          </a>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{content.title}</h3>
        <p className="text-white/60 text-sm mb-3 line-clamp-2">{content.description}</p>

        <div className="flex items-center justify-between text-sm text-white/60 mb-4">
          <span className="flex items-center gap-1">
            <span>{content.genre}</span>
          </span>
          {content.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{content.duration}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">{content.price} Credits</span>
          </div>

          <div className="flex gap-2">
            <a
              href={`/content/${content.id}`}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4" />
              Details
            </a>

            {isOwned ? (
              <button className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 font-medium flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch
              </button>
            ) : (
              <button
                onClick={() => onPurchase(content)}
                disabled={userCredits < content.price}
                className="px-4 py-2 rounded-xl btn-primary text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
