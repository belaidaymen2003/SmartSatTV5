"use client"

import { useEffect, useMemo, useState } from "react"
import RatingStars from "../Reviews/RatingStars"
import MotionReveal from "../UI/MotionReveal"

interface Review {
  id: string
  contentId: number
  user: string
  rating: number
  text: string
  createdAt: number
  updatedAt: number
}

function loadAllReviews(): Review[] {
  const raw = localStorage.getItem('reviews')
  if (!raw) return []
  try { return JSON.parse(raw) as Review[] } catch { return [] }
}

function saveAllReviews(reviews: Review[]) {
  localStorage.setItem('reviews', JSON.stringify(reviews))
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface ReviewsSectionProps {
  contentId: number
  contentTitle: string
  userEmail: string
}

export default function ReviewsSection({ contentId, contentTitle, userEmail }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [myRating, setMyRating] = useState(0)
  const [myText, setMyText] = useState("")
  const [hasLoaded, setHasLoaded] = useState(false)

  // Load from storage
  useEffect(() => {
    const all = loadAllReviews()
    setReviews(all.filter(r => r.contentId === contentId).sort((a,b) => b.updatedAt - a.updatedAt))
    const mine = all.find(r => r.contentId === contentId && r.user === userEmail)
    if (mine) { setMyRating(mine.rating); setMyText(mine.text) }
    setHasLoaded(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'reviews') {
        const next = loadAllReviews()
        setReviews(next.filter(r => r.contentId === contentId).sort((a,b) => b.updatedAt - a.updatedAt))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [contentId, userEmail])

  const avg = useMemo(() => {
    if (!reviews.length) return 0
    return Number((reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1))
  }, [reviews])

  const myReview = useMemo(() => reviews.find(r => r.user === userEmail) || null, [reviews, userEmail])

  const submit = () => {
    if (!userEmail) return alert('Please sign in to post a review.')
    if (myRating < 1 || myRating > 5) return alert('Please select a rating from 1 to 5.')

    const all = loadAllReviews()
    const existingIndex = all.findIndex(r => r.contentId === contentId && r.user === userEmail)
    if (existingIndex >= 0) {
      const updated: Review = { ...all[existingIndex], rating: myRating, text: myText, updatedAt: Date.now() }
      all[existingIndex] = updated
    } else {
      all.push({ id: uid(), contentId, user: userEmail, rating: myRating, text: myText, createdAt: Date.now(), updatedAt: Date.now() })
    }
    saveAllReviews(all)
    setReviews(all.filter(r => r.contentId === contentId).sort((a,b) => b.updatedAt - a.updatedAt))
    window.dispatchEvent(new StorageEvent('storage', { key: 'reviews' }))
  }

  const remove = () => {
    if (!myReview) return
    const all = loadAllReviews().filter(r => !(r.contentId === contentId && r.user === userEmail))
    saveAllReviews(all)
    setReviews(all.filter(r => r.contentId === contentId).sort((a,b) => b.updatedAt - a.updatedAt))
    setMyRating(0); setMyText("")
    window.dispatchEvent(new StorageEvent('storage', { key: 'reviews' }))
  }

  return (
    <MotionReveal>
      <div className="glass rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Reviews & Ratings</h3>
            <p className="text-white/60 text-sm">Share your thoughts about {contentTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <RatingStars value={avg} readOnly size={22} />
            <div className="text-white font-semibold">{avg} <span className="text-white/60 text-sm">({reviews.length})</span></div>
          </div>
        </div>

        {/* Editor */}
        <div className="glass rounded-xl p-4 border border-white/10">
          {!userEmail ? (
            <div className="text-white/70 text-sm">Please <a href="/" className="underline">sign in</a> to rate and review.</div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-white/80 text-sm mb-1">Your rating</p>
                <RatingStars value={myRating} onChange={setMyRating} size={24} />
              </div>
              <div>
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                  placeholder="Write your review (optional)"
                  value={myText}
                  onChange={(e) => setMyText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={submit} className="px-4 py-2 rounded-lg btn-primary text-white font-semibold">
                  {myReview ? 'Update Review' : 'Submit Review'}
                </button>
                {myReview && (
                  <button onClick={remove} className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium">Delete</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="mt-6 space-y-3 max-h-[420px] overflow-auto pr-1">
          {hasLoaded && reviews.length === 0 && (
            <div className="text-white/60 text-sm">No reviews yet. Be the first to review.</div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <div className="text-white text-sm font-semibold">{r.user.split('@')[0]}</div>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <RatingStars value={r.rating} readOnly size={16} />
                  <span>{new Date(r.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              {r.text ? <p className="text-white/80 whitespace-pre-wrap">{r.text}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </MotionReveal>
  )
}
