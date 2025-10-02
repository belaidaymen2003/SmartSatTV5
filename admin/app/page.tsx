"use client"

import { useState } from 'react'
import { Lock, Mail, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Logo from '../public/Logo2.png'
import Image from 'next/image'

export default function AdminLoginPage() {
   const router = useRouter()
  const [emailorusername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emailorusername, password }) })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || 'Invalid credentials')
      }
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden text-white p-6">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 opacity-50 w-full h-full object-cover z-0"
      >
        <source src="https://ik.imagekit.io/belaidaymen444/projects/SmartSatTV/Assets/Silky_Blue_4K_Motion_Background_Loop.mp4?updatedAt=1759431314017" type="video/mp4" />
      </video>
      {/* Overlay for darkening effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-80 z-10" />
      {/* Content */}
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl relative z-20">
      <div className="mb-6 text-center">
          <Image src={Logo} alt="Logo" className="w-28 h-28 mx-auto mb-2" />
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to access the dashboard</p>
        </div>

        {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>}

        <label className="block text-sm text-white/70 mb-2">Email or username</label>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 mb-4">
          <Mail className="w-4 h-4 text-white/60" />
          <input value={emailorusername} onChange={(e) => setEmailOrUsername(e.target.value)} type="text" required placeholder="you@example.com" className="bg-transparent outline-none text-white placeholder-white/40 w-full" />
        </div>

        <label className="block text-sm text-white/70 mb-2">Password</label>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 mb-6">
          <Lock className="w-4 h-4 text-white/60" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="bg-transparent outline-none text-white placeholder-white/40 w-full" />
        </div>

        <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60">
          <LogIn className="w-4 h-4" />
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

  <div className="text-xs text-white/50 mt-4">Default admin: admin@hotflix.local / admin123</div>
      </form>
    </div>
  )
}
