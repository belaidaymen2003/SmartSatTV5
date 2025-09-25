'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Grid, Users, MessageCircle, Star, Settings, ArrowLeft, LogOut } from 'lucide-react'
import logo from '../../public/Logo2.png'

export default function Sidebar() {
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }
  return (
    <aside className="w-72 min-h-screen bg-black/30 backdrop-blur-sm text-white border-r border-white/10 fixed left-0 top-0">
      <div className="px-6 py-8 flex items-center gap-3">
        <Image src={logo} alt="Hotflix" width={40} height={40} />
        <div>
          <h3 className="font-bold text-lg text-orange-400">HOTFLIX</h3>
          <p className="text-xs text-white/60">Admin</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-2">
        <div className="px-3 py-2 flex items-center gap-3 rounded-md bg-white/5">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-semibold">JD</div>
          <div>
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-xs text-white/60">Administrator</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
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

        <div className="mt-6 border-t border-white/6 pt-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">BACK TO HOTFLIX</span>
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
