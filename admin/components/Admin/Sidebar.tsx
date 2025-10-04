'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Home, Grid, Users, MessageCircle, Star, Settings, ArrowLeft, LogOut, User, Globe, Zap, PlayCircle, ChevronDown, Folder } from 'lucide-react'
import logo from '../../public/Logo2.png'

export default function Sidebar({ className = '' }: { className?: string }) {
  const [categoriesOpen, setCategoriesOpen] = useState(true)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/'
  }
  return (
    <aside className={`flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center gap-3 pt-3 w-72 overflow-auto h-screen bg-black/30 backdrop-blur-sm text-white border-r border-white/10  ${className}`}>
      <div className=" flex items-center gap-3">
        <Image src={logo} alt="Hotflix" width={100} height={100} />
      </div>

      <div className=" w-[95%] flex flex-col gap-4">
        <div className=" flex items-center gap-3 py-2 px-1 rounded-md bg-white/5">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-semibold"> <User /> </div>
          <div>
            <div className="text-xs text-white/60">Administrator</div>
          </div>
        </div>

        {/* Primary navigation */}
        <nav className=" flex flex-col gap-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-orange-400 bg-orange-500/10">
            <Home className="w-4 h-4" />
            <span className="text-sm font-semibold">DASHBOARD</span>
          </Link>
          <Link href="/admin/catalog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <Grid className="w-4 h-4" />
            <span className="text-sm">CATALOG</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <Users className="w-4 h-4" />
            <span className="text-sm">USERS</span>
          </Link>
          <Link href="/admin/comments" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">COMMENTS</span>
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <Star className="w-4 h-4" />
            <span className="text-sm">REVIEWS</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">SETTINGS</span>
          </Link>
        </nav>

        {/* Requested quick links */}
        <div className="mt-2">
          <div className="text-[10px] uppercase tracking-wider text-white/40 px-3 pb-1">Quick Actions</div>
          <div className="flex flex-col gap-1">
            <Link href="/admin/bein-sport-auto" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">beIN SPORT Auto</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">HOT</span>
            </Link>
            <Link href="/admin/mango-auto" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Mango Auto</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">HOT</span>
            </Link>
            <Link href="/admin/ibo-player-auto" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
              <PlayCircle className="w-4 h-4" />
              <span className="text-sm">ibo Player Auto</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">HOT</span>
            </Link>
          </div>
        </div>

        {/* Categories dropdown */}
        <div className="mt-2">
          <button onClick={() => setCategoriesOpen((v) => !v)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <Folder className="w-4 h-4" />
            <span className="text-sm font-medium">Categories</span>
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
          </button>
          {categoriesOpen && (
            <div className="mt-1 pl-6 flex flex-col gap-1">
              <Link href="/admin/categories/iptv" className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 text-sm">IPTV</Link>
              <Link href="/admin/categories/gift-cards" className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 text-sm">GIFT CARDS</Link>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-white/6 pt-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">BACK TO Client</span>
          </Link>
          <button onClick={logout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">LOG OUT</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
