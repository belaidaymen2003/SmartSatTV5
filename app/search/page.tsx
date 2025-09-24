'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Layout/Header'
import ContentCard, { Content } from '../../components/Content/ContentCard'
import { 
  Search,
  Filter,
  Clock,
  TrendingUp,
  Star,
  Calendar,
  User
} from 'lucide-react'

export default function SearchPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  // Mock content database
  const allContent: Content[] = [
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
      director: "James Cameron"
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
      actors: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"]
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
      director: "Matt Reeves"
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
      actors: ["Paddy Considine", "Emma D'Arcy", "Matt Smith"]
    }
  ]

  const trendingSearches = ["Avatar", "Batman", "Stranger Things", "Action Movies", "Sci-Fi"]
  const popularGenres = ["Action", "Sci-Fi", "Fantasy", "Thriller", "Drama", "Comedy"]

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')
    const storedSearchHistory = localStorage.getItem('searchHistory')
    
    if (!storedEmail) {
      router.push('/')
      return
    }
    
    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) setUserEmail(storedEmail)
    if (storedSearchHistory) {
      setRecentSearches(JSON.parse(storedSearchHistory).slice(0, 5))
    }
  }, [router])

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      const results = allContent.filter(item => {
        const searchLower = query.toLowerCase()
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.genre.toLowerCase().includes(searchLower) ||
          (item.actors && item.actors.some(actor => actor.toLowerCase().includes(searchLower))) ||
          (item.director && item.director.toLowerCase().includes(searchLower))
        )
      })
      
      setSearchResults(results)
      setIsSearching(false)
      
      // Add to search history
      if (query.trim() && !recentSearches.includes(query)) {
        const newHistory = [query, ...recentSearches].slice(0, 5)
        setRecentSearches(newHistory)
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      }
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
  }

  // Debounced instant search on typing
  useEffect(() => {
    if (!searchTerm) return
    const t = setTimeout(() => performSearch(searchTerm), 400)
    return () => clearTimeout(t)
  }, [searchTerm])

  const handleQuickSearch = (query: string) => {
    setSearchTerm(query)
    performSearch(query)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Advanced Search</h1>
          <p className="text-blue-200">Find content by title, genre, actor, director, or year</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for movies, series, actors, directors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl btn-primary text-white font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Suggestions */}
        {!searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Trending Searches</h3>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Genres */}
            <div className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Popular Genres</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularGenres.map((genre, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(genre)}
                    className="px-3 py-2 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors text-sm"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isSearching ? 'Searching...' : `Search Results for "${searchTerm}"`}
              </h2>
              {!isSearching && (
                <p className="text-white/60">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Results Grid */}
            {!isSearching && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    onPurchase={handlePurchase}
                    onViewDetails={handleViewDetails}
                    userCredits={credits}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && searchResults.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-white/60 mb-4">
                  We couldn't find any content matching "{searchTerm}"
                </p>
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Try searching for:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {trendingSearches.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(suggestion)}
                        className="px-3 py-1 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
