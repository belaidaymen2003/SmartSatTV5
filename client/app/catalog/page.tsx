'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Layout/Header'
import ContentCard, { Content } from '../../components/Content/ContentCard'
import { 
  Filter, 
  Search,
  Film,
  Tv,
  Radio,
  Gamepad2,
  Calendar,
  Star,
  SlidersHorizontal
} from 'lucide-react'

export default function CatalogPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

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

  const content: Content[] = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      type: "movie",
      price: 18,
      rating: 4.8,
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
      description: "Epic sci-fi adventure in stunning underwater worlds with groundbreaking visual effects",
      duration: "3h 12m",
      genre: "Sci-Fi",
      year: 2022,
      actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      director: "James Cameron"
    },
    {
      id: 2,
      title: "Stranger Things S4",
      type: "series",
      price: 25,
      rating: 4.9,
      image: "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg",
      description: "Supernatural thriller series with mind-bending mysteries and nostalgic 80s atmosphere",
      duration: "8 episodes",
      genre: "Thriller",
      year: 2022,
      actors: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"]
    },
    {
      id: 3,
      title: "CNN Live Stream",
      type: "live",
      price: 10,
      rating: 4.5,
      image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg",
      description: "24/7 news coverage and breaking news updates from around the world",
      duration: "Live",
      genre: "News",
      year: 2024
    },
    {
      id: 4,
      title: "Gaming Championship",
      type: "gaming",
      price: 8,
      rating: 4.7,
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      description: "Live esports tournament featuring the world's top professional gamers",
      duration: "Live",
      genre: "Esports",
      year: 2024
    },
    {
      id: 5,
      title: "The Batman",
      type: "movie",
      price: 15,
      rating: 4.6,
      image: "https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg",
      description: "Dark knight returns in this thrilling superhero film with a noir atmosphere",
      duration: "2h 56m",
      genre: "Action",
      year: 2022,
      actors: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
      director: "Matt Reeves"
    },
    {
      id: 6,
      title: "House of Dragon",
      type: "series",
      price: 20,
      rating: 4.4,
      image: "https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg",
      description: "Epic fantasy series set in the world of Westeros, 200 years before Game of Thrones",
      duration: "10 episodes",
      genre: "Fantasy",
      year: 2022,
      actors: ["Paddy Considine", "Emma D'Arcy", "Matt Smith"]
    },
    {
      id: 7,
      title: "Top Gun: Maverick",
      type: "movie",
      price: 16,
      rating: 4.7,
      image: "https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg",
      description: "Pete 'Maverick' Mitchell returns to train a new generation of Top Gun pilots",
      duration: "2h 11m",
      genre: "Action",
      year: 2022,
      actors: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
      director: "Joseph Kosinski"
    },
    {
      id: 8,
      title: "The Bear S2",
      type: "series",
      price: 22,
      rating: 4.8,
      image: "https://images.pexels.com/photos/7991320/pexels-photo-7991320.jpeg",
      description: "Intense kitchen drama following a young chef trying to save his family's restaurant",
      duration: "10 episodes",
      genre: "Drama",
      year: 2023,
      actors: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri"]
    }
  ]

  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Fantasy', 'Thriller', 'News', 'Esports']
  const years = ['All', '2024', '2023', '2022', '2021', '2020']

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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.actors && item.actors.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory
    const matchesGenre = selectedGenre === 'all' || selectedGenre.toLowerCase() === 'all' || item.genre.toLowerCase() === selectedGenre.toLowerCase()
    const matchesYear = selectedYear === 'all' || selectedYear.toLowerCase() === 'all' || item.year?.toString() === selectedYear
    
    return matchesSearch && matchesCategory && matchesGenre && matchesYear
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'year':
        return (b.year || 0) - (a.year || 0)
      case 'price':
        return a.price - b.price
      default:
        return a.title.localeCompare(b.title)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Content Catalog</h1>
          <p className="text-blue-200">Discover amazing movies, series, live TV, and gaming content</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, description, or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl glass border border-white/20 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="title" className="bg-slate-800">Title</option>
                <option value="rating" className="bg-slate-800">Rating</option>
                <option value="year" className="bg-slate-800">Year</option>
                <option value="price" className="bg-slate-800">Price</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="glass rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All', icon: <Filter className="w-4 h-4" /> },
                      { id: 'movie', label: 'Movies', icon: <Film className="w-4 h-4" /> },
                      { id: 'series', label: 'Series', icon: <Tv className="w-4 h-4" /> },
                      { id: 'live', label: 'Live TV', icon: <Radio className="w-4 h-4" /> },
                      { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> }
                    ].map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        {category.icon}
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/20 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre.toLowerCase()} className="bg-slate-800">
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/20 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {years.map((year) => (
                      <option key={year} value={year.toLowerCase()} className="bg-slate-800">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/60">
            Showing {filteredContent.length} of {content.length} results
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onPurchase={handlePurchase}
              onViewDetails={handleViewDetails}
              userCredits={credits}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}