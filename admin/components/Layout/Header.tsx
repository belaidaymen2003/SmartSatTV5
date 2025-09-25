'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Satellite, 
  Search, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  Coins,
  Menu,
  X
} from 'lucide-react'
import logo from '../../public/Logo2.png'

interface HeaderProps {
  credits?: number
  userEmail?: string
  onLogout?: () => void
}

export default function Header({ credits = 0, userEmail = '', onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('userCredits')
      localStorage.removeItem('userEmail')
      window.location.href = '/'
    }
  }

  return (
    <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src={logo} 
              alt="SmartSatTV Logo" 
              width={60} 
              height={60} 
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Home</a>
            <a href="/catalog" className="text-white/80 hover:text-white transition-colors">Catalog</a>
            <a href="/live" className="text-white/80 hover:text-white transition-colors">Live TV</a>
            <a href="/search" className="text-white/80 hover:text-white transition-colors">Search</a>
            <a href="/profile" className="text-white/80 hover:text-white transition-colors">My Space</a>
            <a href="/support" className="text-white/80 hover:text-white transition-colors">Support</a>
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            {credits > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{credits} Credits</span>
              </div>
            )}
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
              {userEmail && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{userEmail.split('@')[0]}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/dashboard' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/catalog' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                Catalog
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/live' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                Live TV
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/search' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                Search
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/profile' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                My Space
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); window.location.href = '/support' }}
                className="text-white/80 hover:text-white transition-colors text-left"
              >
                Support
              </button>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Settings className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
