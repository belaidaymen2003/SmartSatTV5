"use client"

import { useEffect, useMemo, useState } from "react"
import Header from "../../components/Layout/Header"
import SectionHeader from "../../components/UI/SectionHeader"
import Carousel from "../../components/UI/Carousel"
import MotionReveal from "../../components/UI/MotionReveal"
import ContentCard, { Content } from "../../components/Content/ContentCard"
import { useRouter } from "next/navigation"
import { Play, Radio, Tv, Trophy, Newspaper, Gamepad2 } from "lucide-react"

export default function LiveTVPage() {
  const router = useRouter()
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')
    if (!storedEmail) {
      router.push('/')
      return
    }
    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) setUserEmail(storedEmail)
  }, [router])

  const channels: Content[] = [
    { id: 101, title: "World News 24", type: "live", price: 8, rating: 4.4, image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg", description: "Breaking news from around the globe.", duration: "Live", genre: "News", year: 2025 },
    { id: 102, title: "Sports Center HD", type: "live", price: 10, rating: 4.6, image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg", description: "Live sports, highlights, and analysis.", duration: "Live", genre: "Sports", year: 2025 },
    { id: 103, title: "CinePrime Live", type: "live", price: 7, rating: 4.2, image: "https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg", description: "Blockbusters and movie talk shows.", duration: "Live", genre: "Entertainment", year: 2025 },
    { id: 104, title: "eSports Arena", type: "live", price: 9, rating: 4.7, image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg", description: "Top tournaments, pro matches & commentary.", duration: "Live", genre: "Esports", year: 2025 },
    { id: 105, title: "Documentary One", type: "live", price: 6, rating: 4.3, image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg", description: "Nature, history, and science docs.", duration: "Live", genre: "Documentary", year: 2025 },
    { id: 106, title: "Fashion TV+", type: "live", price: 5, rating: 4.1, image: "https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg", description: "Trends, runway, and lifestyle.", duration: "Live", genre: "Lifestyle", year: 2025 },
    { id: 107, title: "TechStream", type: "live", price: 7, rating: 4.5, image: "https://images.pexels.com/photos/3861979/pexels-photo-3861979.jpeg", description: "Gadgets, reviews, and launches.", duration: "Live", genre: "Technology", year: 2025 },
    { id: 108, title: "Global Finance", type: "live", price: 8, rating: 4.2, image: "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg", description: "Markets, business news, and analysis.", duration: "Live", genre: "Business", year: 2025 },
  ]

  const schedule = [
    { time: 'Now', title: 'Headlines Live', channel: 'World News 24', tag: 'News' },
    { time: '19:30', title: 'Champions League Pre-show', channel: 'Sports Center HD', tag: 'Football' },
    { time: '20:00', title: 'Pro League Finals', channel: 'eSports Arena', tag: 'Esports' },
    { time: '21:00', title: 'Ocean Wonders', channel: 'Documentary One', tag: 'Nature' },
    { time: '21:30', title: 'Red Carpet Live', channel: 'Fashion TV+', tag: 'Lifestyle' },
  ]

  const categories = [
    { key: 'All', icon: <Radio className="w-4 h-4" /> },
    { key: 'News', icon: <Newspaper className="w-4 h-4" /> },
    { key: 'Sports', icon: <Trophy className="w-4 h-4" /> },
    { key: 'Entertainment', icon: <Tv className="w-4 h-4" /> },
    { key: 'Esports', icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'Documentary', icon: <Tv className="w-4 h-4" /> },
    { key: 'Lifestyle', icon: <Tv className="w-4 h-4" /> },
    { key: 'Technology', icon: <Tv className="w-4 h-4" /> },
    { key: 'Business', icon: <Tv className="w-4 h-4" /> },
  ]

  const [activeCat, setActiveCat] = useState<string>('All')

  const filtered = useMemo(() => {
    if (activeCat === 'All') return channels
    return channels.filter(c => c.genre === activeCat)
  }, [channels, activeCat])

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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header credits={credits} userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Title */}
        <MotionReveal>
          <SectionHeader
            title="Live TV"
            subtitle="News, sports, entertainment and more streaming right now"
            action={<a href="/catalog" className="text-sm text-white/60 hover:text-white">Browse All Content</a>}
          />
        </MotionReveal>

        {/* Now Playing Carousel */}
        <section>
          <MotionReveal>
            <h3 className="text-lg font-semibold text-white/90 mb-3">Now Playing</h3>
            <Carousel itemWidthPx={260} autoPlayMs={2800}>
              {channels.map((ch) => (
                <div key={ch.id}>
                  <ContentCard
                    content={ch}
                    onPurchase={handlePurchase}
                    onViewDetails={handleViewDetails}
                    userCredits={credits}
                  />
                </div>
              ))}
            </Carousel>
          </MotionReveal>
        </section>

        {/* Categories */}
        <section>
          <MotionReveal delayMs={40}>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  className={`px-4 py-2 rounded-full border transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeCat === key
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'glass border-white/20 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {icon}
                  <span>{key}</span>
                </button>
              ))}
            </div>
          </MotionReveal>
        </section>

        {/* Channels Grid */}
        <section>
          <MotionReveal delayMs={80}>
            <SectionHeader
              title={activeCat === 'All' ? 'All Channels' : `${activeCat} Channels`}
              action={<a href="#schedule" className="text-sm text-white/60 hover:text-white">View Schedule</a>}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filtered.map((ch) => (
                <ContentCard
                  key={ch.id}
                  content={ch}
                  onPurchase={handlePurchase}
                  onViewDetails={handleViewDetails}
                  userCredits={credits}
                />
              ))}
            </div>
          </MotionReveal>
        </section>

        {/* Schedule */}
        <section id="schedule">
          <MotionReveal delayMs={120}>
            <SectionHeader
              title="Live Schedule"
              subtitle="What's on tonight"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-white/70">
              {schedule.map((row, i) => (
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
      </main>
    </div>
  )
}
