'use client'

import { useMemo } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import logo from '../public/Logo2.png'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Loading3D from '../components/Loading3D'
import Spinner from '@/components/Spinner'

const Background = React.memo(() => {
  const [particles, setParticles] = React.useState<{
    left: number
    top: number
    delay: number
    reverse: boolean
  }[] | null>(null)

  React.useEffect(() => {
    // Generate particles only on client after mount to avoid SSR/CSR mismatch
    const generated = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      reverse: Math.random() > 0.5,
    }))
    setParticles(generated)
  }, [])

  return (
    <>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
          alt="Mountain Nature Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        {particles
          ? particles.map((p, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white/20 rounded-full ${p.reverse ? 'animate-float-reverse' : 'animate-float'}`}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))
          : null}

        {/* Geometric Shapes (static placement to avoid randomness on server) */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45 animate-float"></div>
        <div className="absolute bottom-40 left-52 w-28 h-28 border border-white/10 rotate-45 animate-float"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-blue-300/20 rotate-12 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-pulse-custom"></div>
        <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse-custom"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-pulse-custom"></div>
      </div>
    </>
  )
})

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('userCredits', '150')
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="glass rounded-xl p-8 shadow-2xl animate-slide-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-blue-200">Sign in to access your streaming dashboard</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-white font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            placeholder="Enter your email"
            required
          />
        </div>
        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-white font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-6 rounded-lg btn-primary text-white font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spinner/>
              <span>Signing In...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm">
          Don't have an account?{' '}
          <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors font-medium">
            Telegram Channel Smart Sat TV
          </a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className=" flex flex-col items-center text-center mb-4 animate-slide-in">
            <Image
              src={logo}
              alt="SMART SAT TV Logo"
              width={120}
              height={120}
            />
            <p className="text-blue-200 text-lg">Premium Streaming Experience</p>
          </div>
          <LoginForm />
          {/* Additional Info */}
          <div className="text-center mt-8 animate-slide-in">
            <p className="text-white/40 text-sm">
              © 2025 SMART SAT TV. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
