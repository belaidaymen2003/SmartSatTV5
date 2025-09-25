'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '../../../components/Layout/Header'
import {
  Play,
  Star,
  Clock,
  Calendar,
  User,
  Heart,
  Share2,
  Download,
  ShoppingCart,
  Coins,
  ArrowLeft,
  Film,
  Tv,
  Radio,
  Gamepad2,
  X
} from 'lucide-react'
import ReviewsSection from '../../../components/Reviews/ReviewsSection'

interface ContentDetail {
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
  longDescription?: string
  seasons?: number
  episodes?: number
}

export default function ContentDetailPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [isOwned, setIsOwned] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const router = useRouter()
  const params = useParams()
  const contentId = parseInt(params.id as string)

  // Content source (should come from API/CMS in production)
  const contentById: Record<number, ContentDetail> = {
    1: {
      id: 1,
      title: "Avatar: The Way of Water",
      type: "movie",
      price: 18,
      rating: 4.8,
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
      description: "Epic sci-fi adventure in stunning underwater worlds",
      longDescription: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
      duration: "3h 12m",
      genre: "Sci-Fi",
      year: 2022,
      actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"],
      director: "James Cameron",
      trailer: "https://videos.pexels.com/video-files/7978887/7978887-uhd_2560_1440_30fps.mp4"
    },
    2: {
      id: 2,
      title: "Stranger Things S4",
      type: "series",
      price: 25,
      rating: 4.9,
      image: "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg",
      description: "Supernatural thriller series with mind-bending mysteries",
      duration: "8 episodes",
      genre: "Thriller",
      year: 2022,
      actors: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"],
      trailer: "https://videos.pexels.com/video-files/8963635/8963635-uhd_2560_1440_25fps.mp4"
    },
    3: {
      id: 3,
      title: "The Batman",
      type: "movie",
      price: 15,
      rating: 4.6,
      image: "https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg",
      description: "Dark knight returns in this thrilling superhero film",
      duration: "2h 56m",
      genre: "Action",
      year: 2022,
      actors: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
      director: "Matt Reeves",
      trailer: "https://videos.pexels.com/video-files/2897627/2897627-uhd_2732_1440_25fps.mp4"
    },
    4: {
      id: 4,
      title: "House of Dragon",
      type: "series",
      price: 20,
      rating: 4.4,
      image: "https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg",
      description: "Epic fantasy series set in the world of Westeros",
      duration: "10 episodes",
      genre: "Fantasy",
      year: 2022,
      actors: ["Paddy Considine", "Emma D'Arcy", "Matt Smith"],
      trailer: "https://videos.pexels.com/video-files/2775949/2775949-uhd_2560_1440_25fps.mp4"
    },
    5: {
      id: 5,
      title: "CNN Live Stream",
      type: "live",
      price: 10,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg",
      description: "24/7 news coverage and breaking news updates",
      duration: "Live",
      genre: "News",
      year: 2024
    },
    6: {
      id: 6,
      title: "Sports Center Live",
      type: "live",
      price: 12,
      rating: 4.6,
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      description: "Live sports coverage and highlights",
      duration: "Live",
      genre: "Sports",
      year: 2024
    },
    7: {
      id: 7,
      title: "Gaming Championship",
      type: "gaming",
      price: 8,
      rating: 4.7,
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      description: "Live esports tournament featuring top gamers",
      duration: "Live",
      genre: "Esports",
      year: 2024
    },
    101: {
      id: 101,
      title: "World News 24",
      type: "live",
      price: 8,
      rating: 4.4,
      image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg",
      description: "Breaking news from around the globe.",
      duration: "Live",
      genre: "News",
      year: 2025
    },
    102: {
      id: 102,
      title: "Sports Center HD",
      type: "live",
      price: 10,
      rating: 4.6,
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
      description: "Live sports, highlights, and analysis.",
      duration: "Live",
      genre: "Sports",
      year: 2025
    },
    103: {
      id: 103,
      title: "CinePrime Live",
      type: "live",
      price: 7,
      rating: 4.2,
      image: "https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg",
      description: "Blockbusters and movie talk shows.",
      duration: "Live",
      genre: "Entertainment",
      year: 2025
    },
    104: {
      id: 104,
      title: "eSports Arena",
      type: "live",
      price: 9,
      rating: 4.7,
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      description: "Top tournaments, pro matches & commentary.",
      duration: "Live",
      genre: "Esports",
      year: 2025
    },
    105: {
      id: 105,
      title: "Documentary One",
      type: "live",
      price: 6,
      rating: 4.3,
      image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      description: "Nature, history, and science docs.",
      duration: "Live",
      genre: "Documentary",
      year: 2025
    },
    106: {
      id: 106,
      title: "Fashion TV+",
      type: "live",
      price: 5,
      rating: 4.1,
      image: "https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg",
      description: "Trends, runway, and lifestyle.",
      duration: "Live",
      genre: "Lifestyle",
      year: 2025
    },
    107: {
      id: 107,
      title: "TechStream",
      type: "live",
      price: 7,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3861979/pexels-photo-3861979.jpeg",
      description: "Gadgets, reviews, and launches.",
      duration: "Live",
      genre: "Technology",
      year: 2025
    },
    108: {
      id: 108,
      title: "Global Finance",
      type: "live",
      price: 8,
      rating: 4.2,
      image: "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg",
      description: "Markets, business news, and analysis.",
      duration: "Live",
      genre: "Business",
      year: 2025
    }
  }

  const contentDetails = contentById[contentId]

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')

    if (!storedEmail) {
      router.push('/')
      return
    }
    if (!contentDetails) {
      router.push('/catalog')
      return
    }

    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) setUserEmail(storedEmail)

    const wl = localStorage.getItem('watchlist')
    if (wl) {
      try { setIsFavorite(JSON.parse(wl).includes(contentId)) } catch {}
    }
    const owned = localStorage.getItem('ownedContent')
    if (owned) {
      try { setIsOwned(JSON.parse(owned).includes(contentId)) } catch {}
    }
  }, [router, contentDetails, contentId])

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="w-5 h-5" />
      case 'series': return <Tv className="w-5 h-5" />
      case 'live': return <Radio className="w-5 h-5" />
      case 'gaming': return <Gamepad2 className="w-5 h-5" />
      default: return <Play className="w-5 h-5" />
    }
  }

  const handlePurchase = () => {
    if (!contentDetails) return
    if (credits >= contentDetails.price) {
      const newCredits = credits - contentDetails.price
      setCredits(newCredits)
      localStorage.setItem('userCredits', newCredits.toString())
      setIsOwned(true)
      const ownedRaw = localStorage.getItem('ownedContent')
      let ownedIds: number[] = []
      if (ownedRaw) { try { ownedIds = JSON.parse(ownedRaw) } catch { ownedIds = [] } }
      if (!ownedIds.includes(contentDetails.id)) ownedIds.push(contentDetails.id)
      localStorage.setItem('ownedContent', JSON.stringify(ownedIds))
      alert(`Successfully purchased "${contentDetails.title}" for ${contentDetails.price} credits!`)
    } else {
      alert('Insufficient credits! Please add more credits to your account.')
    }
  }

  const handleWatch = () => {
    if (!contentDetails) return
    router.push(`/player/${contentDetails.id}`)
  }

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => {
      const next = !prev
      const raw = localStorage.getItem('watchlist')
      let ids: number[] = []
      if (raw) { try { ids = JSON.parse(raw) } catch { ids = [] } }
      if (contentDetails) {
        if (next && !ids.includes(contentDetails.id)) ids.push(contentDetails.id)
        if (!next) ids = ids.filter((id) => id !== contentDetails.id)
        localStorage.setItem('watchlist', JSON.stringify(ids))
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />

      {!contentDetails ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Content not found</h1>
          <p className="text-white/70 mb-6">The requested title does not exist or was removed.</p>
          <a href="/catalog" className="px-6 py-3 rounded-xl btn-primary text-white font-semibold inline-block">Back to Catalog</a>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => history.length > 1 ? router.back() : (window.location.href = '/catalog')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                <Image
                  src={contentDetails.image}
                  alt={contentDetails.title}
                  fill
                  className="object-cover"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 text-white">
                  {getCategoryIcon(contentDetails.type)}
                  <span className="capitalize font-medium">{contentDetails.type}</span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-2 rounded-full bg-black/70 text-white">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{contentDetails.rating}</span>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title and Basic Info */}
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">{contentDetails.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-white/80 mb-4">
                    {contentDetails.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{contentDetails.year}</span>
                      </div>
                    )}

                    {contentDetails.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{contentDetails.duration}</span>
                      </div>
                    )}

                    <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                      {contentDetails.genre}
                    </div>
                  </div>

                  <p className="text-white/60 text-lg leading-relaxed">
                    {contentDetails.description}
                  </p>
                </div>

                {/* Long Description */}
                {contentDetails.longDescription && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                    <p className="text-white/80 leading-relaxed">
                      {contentDetails.longDescription}
                    </p>
                  </div>
                )}

                {/* Cast and Crew */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contentDetails.director && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                      <p className="text-white/80">{contentDetails.director}</p>
                    </div>
                  )}

                  {contentDetails.actors && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                      <div className="flex flex-wrap gap-2">
                        {contentDetails.actors.map((actor, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  {isOwned ? (
                    <button
                      onClick={handleWatch}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Watch Now
                    </button>
                  ) : (
                    <button
                      onClick={handlePurchase}
                      disabled={credits < contentDetails.price}
                      className="px-8 py-3 rounded-xl btn-primary text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy for {contentDetails.price} Credits
                    </button>
                  )}

                  {contentDetails.trailer && (
                    <button onClick={() => setShowTrailer(true)} className="px-6 py-3 rounded-xl glass border border-white/20 text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  )}

                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-xl border transition-colors ${
                      isFavorite
                        ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'glass border-white/20 text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button className="p-3 rounded-xl glass border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Price Info */}
                {!isOwned && (
                  <div className="glass rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Purchase this content</h3>
                        <p className="text-white/60">Watch unlimited times after purchase</p>
                      </div>
                      <div className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Coins className="w-6 h-6 text-yellow-400" />
                        {contentDetails.price}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div className="pt-6">
                  <ReviewsSection contentId={contentDetails.id} contentTitle={contentDetails.title} userEmail={userEmail} />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Trailer Modal */}
      {showTrailer && contentDetails?.trailer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden glass border border-white/20">
            <button onClick={() => setShowTrailer(false)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80">
              <X className="w-5 h-5 text-white" />
            </button>
            <video src={contentDetails.trailer} className="w-full h-full object-contain bg-black" controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  )
}
