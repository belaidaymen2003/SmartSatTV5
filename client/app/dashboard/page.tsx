'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../components/Layout/Header'
import ContentCard, { Content } from '../../components/Content/ContentCard'
import Loading3D from '../../components/Loading3D'
import SectionHeader from '../../components/UI/SectionHeader'
import Carousel from '../../components/UI/Carousel'
import MagneticButton from '../../components/UI/MagneticButton'
import MotionReveal from '../../components/UI/MotionReveal'
import {
  Play,
  TrendingUp,
  Star,
  Clock,
  Film,
  Tv,
  Radio,
  Gamepad2,
  ChevronRight,
  Eye,
  Calendar,
  Users
} from 'lucide-react'

export default function DashboardPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [isPageLoading, setIsPageLoading] = useState(true)
  const router = useRouter()
  const [watchlistIds, setWatchlistIds] = useState<number[]>([])

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')

    if (!storedEmail) {
      router.push('/')
      return
    }

    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) setUserEmail(storedEmail)

    const wl = localStorage.getItem('watchlist')
    if (wl) {
      try { setWatchlistIds(JSON.parse(wl)) } catch {}
    }

    // simulate small load and then hide loader
    const t = setTimeout(() => setIsPageLoading(false), 400)
    return () => clearTimeout(t)
  }, [router])

  const featuredContent: Content[] = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      type: "movie",
      price: 18,
      rating: 4.8,
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
      description: "Epic sci-fi adventure in stunning underwater worlds",
      duration: "3h 12m",
      genre: "Sci-Fi",
      year: 2022,
      actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      director: "James Cameron",
      trailer: "https://videos.pexels.com/video-files/7978887/7978887-uhd_2560_1440_30fps.mp4"
    },
    {
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
    {
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
    {
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
    }
  ]

  const liveChannels = [
    {
      id: 5,
      title: "CNN Live Stream",
      type: "live" as const,
      price: 10,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg",
      description: "24/7 news coverage and breaking news updates",
      duration: "Live",
      genre: "News",
      year: 2024
    },
    {
      id: 6,
      title: "Sports Center Live",
      type: "live" as const,
      price: 12,
      rating: 4.6,
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      description: "Live sports coverage and highlights",
      duration: "Live",
      genre: "Sports",
      year: 2024
    }
  ]

  const gamingContent = [
    {
      id: 7,
      title: "Gaming Championship",
      type: "gaming" as const,
      price: 8,
      rating: 4.7,
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      description: "Live esports tournament featuring top gamers",
      duration: "Live",
      genre: "Esports",
      year: 2024
    }
  ]

  const categories = [
    { name: 'Movies', icon: <Film className="w-6 h-6" />, count: 1250, color: 'from-blue-500 to-purple-600' },
    { name: 'Series', icon: <Tv className="w-6 h-6" />, count: 850, color: 'from-green-500 to-teal-600' },
    { name: 'Live TV', icon: <Radio className="w-6 h-6" />, count: 120, color: 'from-red-500 to-pink-600' },
    { name: 'Gaming', icon: <Gamepad2 className="w-6 h-6" />, count: 45, color: 'from-orange-500 to-yellow-600' }
  ]

  const stats = [
    { label: 'Total Users', value: '12,450', icon: <Users className="w-5 h-5" />, change: '+12%' },
    { label: 'Hours Watched', value: '45,230', icon: <Eye className="w-5 h-5" />, change: '+8%' },
    { label: 'New Content', value: '156', icon: <Calendar className="w-5 h-5" />, change: '+25%' }
  ]

  const handlePurchase = (item: Content) => {
    if (credits >= item.price) {
      const newCredits = credits - item.price
      setCredits(newCredits)
      localStorage.setItem('userCredits', newCredits.toString())
      alert(`Successfully purchased "${item.title}" for ${item.price} credits!`)
    } else {
      alert('Insufficient credits! Please add more credits to your account.')
    }
  }

  const handleViewDetails = (item: Content) => {
    router.push(`/content/${item.id}`)
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loading3D />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header credits={credits} userEmail={userEmail} />

      {/* HERO */}
      <section className="relative w-full h-[560px] md:h-[720px] overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
          alt="Featured background"
          fill
          sizes="(max-width: 768px) 100vw, 1600px"
          className="object-cover brightness-50 animate-kenburns"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex items-end md:items-center">
          <div className="py-12 md:py-20 w-full md:w-2/3 lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Fast & Furious</h1>
            <p className="mt-4 text-white/80 max-w-xl">A hilarious adventure featuring the lovable Minions. Enjoy full HD streaming and curated recommendations just for you.</p>

            <div className="mt-8 flex items-center gap-4">
              <MagneticButton
                href="/player/1"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full font-semibold shadow-lg"
              >
                <Play className="w-5 h-5" /> Play
              </MagneticButton>

              <MagneticButton
                href="/content/1"
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/5"
              >
                Details
              </MagneticButton>

              <div className="ml-auto md:ml-0 text-sm text-white/70">Available in HD • No cards shown</div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400"/> 4.8</div>
              <div className="px-2 py-1 bg-white/5 rounded">2024</div>
              <div className="px-2 py-1 bg-white/5 rounded">2h 15m</div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Continue Watching */}
        <section>
          <MotionReveal>
            <SectionHeader
              title="Continue Watching"
              action={<a href="/catalog" className="text-sm text-white/60 hover:text-white">View All</a>}
            />
            <Carousel itemWidthPx={224} autoPlayMs={3200}>
              {featuredContent.map((item) => (
                <div key={item.id}>
                  <ContentCard
                    content={item}
                    onPurchase={handlePurchase}
                    onViewDetails={handleViewDetails}
                    userCredits={credits}
                  />
                </div>
              ))}
            </Carousel>
          </MotionReveal>
        </section>

        {/* Top Picks */}
        <section>
          <MotionReveal delayMs={80}>
            <SectionHeader
              title="Top 10 Movies To Watch"
              action={<a href="/catalog" className="text-sm text-white/60 hover:text-white">See More</a>}
            />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const item = featuredContent[idx % featuredContent.length]
                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white text-sm font-bold grid place-items-center shadow-lg">{idx+1}</div>
                    <ContentCard
                      content={item}
                      onPurchase={handlePurchase}
                      onViewDetails={handleViewDetails}
                      userCredits={credits}
                    />
                  </div>
                )
              })}
            </div>
          </MotionReveal>
        </section>

        {/* Live Now */}
        <section>
          <MotionReveal delayMs={120}>
            <SectionHeader
              title="Live Now"
              subtitle="Breaking news, sports and esports streaming right now"
              action={<a href="/catalog" className="text-sm text-white/60 hover:text-white">Explore</a>}
            />
            <Carousel itemWidthPx={260} autoPlayMs={2800}>
              {[...liveChannels, ...gamingContent].map((item) => (
                <div key={item.id}>
                  <ContentCard
                    content={item}
                    onPurchase={handlePurchase}
                    onViewDetails={handleViewDetails}
                    userCredits={credits}
                  />
                </div>
              ))}
            </Carousel>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
              {[
                { time: 'Now', title: 'Global Headlines', channel: 'CNN', tag: 'News' },
                { time: '20:30', title: 'Champions League Live', channel: 'Sports Center', tag: 'Football' },
                { time: '21:00', title: 'Finals - Match 3', channel: 'Esports Arena', tag: 'Esports' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-white/10">{row.time}</span>
                    <div>
                      <div className="font-semibold text-white">{row.title}</div>
                      <div className="text-white/60">{row.channel}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs">{row.tag}</span>
                </div>
              ))}
            </div>
          </MotionReveal>
        </section>

        {/* Watchlist */}
        {watchlistIds.length > 0 && (
          <section>
            <MotionReveal>
              <SectionHeader
                title="My List"
                subtitle="Your saved movies and series"
                action={<a href="/profile" className="text-sm text-white/60 hover:text-white">Manage</a>}
              />
              <Carousel itemWidthPx={224} autoPlayMs={3400}>
                {featuredContent.concat(liveChannels, gamingContent)
                  .filter((c) => watchlistIds.includes(c.id))
                  .map((item) => (
                    <div key={item.id}>
                      <ContentCard
                        content={item}
                        onPurchase={handlePurchase}
                        onViewDetails={handleViewDetails}
                        userCredits={credits}
                        isOwned={false}
                      />
                    </div>
                  ))}
              </Carousel>
            </MotionReveal>
          </section>
        )}

        {/* Recommendations */}
        <section>
          <MotionReveal>
            <SectionHeader
              title="Recommended For You"
              action={<a href="/profile" className="text-sm text-white/60 hover:text-white">Personalize</a>}
            />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {featuredContent.concat(liveChannels, gamingContent).slice(0,12).map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  onPurchase={handlePurchase}
                  onViewDetails={handleViewDetails}
                  userCredits={credits}
                />
              ))}
            </div>
          </MotionReveal>
        </section>

      </main>

      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-white/60">
          <div>© 2025 SMART SAT TV. All rights reserved.</div>
          <div>Need help? <a href="/support" className="underline">Contact Support</a></div>
        </div>
      </footer>
    </div>
  )
}
