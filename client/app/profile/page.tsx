'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Layout/Header'
import { 
  User, 
  Heart, 
  Clock, 
  Settings, 
  CreditCard,
  Eye,
  Download,
  Star,
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  joinDate: string
  totalWatched: number
  favoriteGenre: string
  watchTime: string
}

interface WatchHistory {
  id: number
  title: string
  type: string
  watchedAt: string
  progress: number
  image: string
}

interface Favorite {
  id: number
  title: string
  type: string
  rating: number
  image: string
  addedAt: string
}

export default function ProfilePage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    joinDate: '2024-01-15',
    totalWatched: 127,
    favoriteGenre: 'Sci-Fi',
    watchTime: '245h 30m'
  })
  const router = useRouter()

  const watchHistory: WatchHistory[] = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      type: "Movie",
      watchedAt: "2024-01-20",
      progress: 100,
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
    },
    {
      id: 2,
      title: "Stranger Things S4",
      type: "Series",
      watchedAt: "2024-01-19",
      progress: 75,
      image: "https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg"
    },
    {
      id: 3,
      title: "The Batman",
      type: "Movie",
      watchedAt: "2024-01-18",
      progress: 100,
      image: "https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg"
    }
  ]

  const favorites: Favorite[] = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      type: "Movie",
      rating: 4.8,
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
      addedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "House of Dragon",
      type: "Series",
      rating: 4.4,
      image: "https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg",
      addedAt: "2024-01-10"
    }
  ]

  useEffect(() => {
    const storedCredits = localStorage.getItem('userCredits')
    const storedEmail = localStorage.getItem('userEmail')
    
    if (!storedEmail) {
      router.push('/')
      return
    }
    
    if (storedCredits) setCredits(parseInt(storedCredits))
    if (storedEmail) {
      setUserEmail(storedEmail)
      setProfile(prev => ({
        ...prev,
        email: storedEmail,
        name: storedEmail.split('@')[0]
      }))
    }
  }, [router])

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to API
    alert('Profile updated successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
    { id: 'history', label: 'Watch History', icon: <Clock className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header credits={credits} userEmail={userEmail} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Space</h1>
          <p className="text-blue-200">Manage your profile, favorites, and viewing preferences</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Watched</p>
                <p className="text-2xl font-bold text-white">{profile.totalWatched}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/20">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Watch Time</p>
                <p className="text-2xl font-bold text-white">{profile.watchTime}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Favorites</p>
                <p className="text-2xl font-bold text-white">{favorites.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Star className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Favorite Genre</p>
                <p className="text-2xl font-bold text-white">{profile.favoriteGenre}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border-b-2 border-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <p className="text-white/80 bg-white/5 px-4 py-3 rounded-xl">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <p className="text-white/80 bg-white/5 px-4 py-3 rounded-xl">{profile.email}</p>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Member Since</label>
                    <p className="text-white/80 bg-white/5 px-4 py-3 rounded-xl">
                      {new Date(profile.joinDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Favorite Genre</label>
                    {isEditing ? (
                      <select
                        value={profile.favoriteGenre}
                        onChange={(e) => setProfile(prev => ({ ...prev, favoriteGenre: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Action" className="bg-slate-800">Action</option>
                        <option value="Sci-Fi" className="bg-slate-800">Sci-Fi</option>
                        <option value="Drama" className="bg-slate-800">Drama</option>
                        <option value="Comedy" className="bg-slate-800">Comedy</option>
                        <option value="Thriller" className="bg-slate-800">Thriller</option>
                      </select>
                    ) : (
                      <p className="text-white/80 bg-white/5 px-4 py-3 rounded-xl">{profile.favoriteGenre}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">My Favorites</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item) => (
                    <div key={item.id} className="glass rounded-xl overflow-hidden border border-white/20">
                      <div className="relative h-48">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{item.type}</p>
                        <p className="text-white/40 text-xs">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Watch History</h3>
                <div className="space-y-4">
                  {watchHistory.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 glass rounded-xl border border-white/20">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{item.type}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                              <span>Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-white/40 text-xs">
                            {new Date(item.watchedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-white/60 text-sm">Receive updates about new content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">Auto-play Next Episode</h4>
                      <p className="text-white/60 text-sm">Automatically play the next episode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">HD Quality by Default</h4>
                      <p className="text-white/60 text-sm">Always start videos in HD quality</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Devices */}
                  <div className="glass rounded-xl border border-white/20 p-4">
                    <h4 className="text-white font-medium mb-3">Your Devices</h4>
                    <div className="space-y-3">
                      {[
                        {name:'iPhone 15 Pro', last:'Today 10:22', location:'Algiers'},
                        {name:'Samsung Smart TV', last:'Yesterday 21:07', location:'Living Room'},
                        {name:'MacBook Air', last:'Jan 20, 09:14', location:'Home'},
                      ].map((d,i)=> (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <div className="text-white">{d.name}</div>
                            <div className="text-white/60 text-xs">Last active: {d.last} • {d.location}</div>
                          </div>
                          <button className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm">Sign out</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full p-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
