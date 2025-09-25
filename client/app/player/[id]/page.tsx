'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '../../../components/Layout/Header'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  ArrowLeft,
  Download,
  Share2,
  Heart,
  MoreHorizontal
} from 'lucide-react'

export default function PlayerPage() {
  const [credits, setCredits] = useState(150)
  const [userEmail, setUserEmail] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [quality, setQuality] = useState('HD')
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  
  const router = useRouter()
  const params = useParams()
  const contentId = parseInt(params.id as string)

  // Content source
  const content = {
    id: contentId,
    title: "Avatar: The Way of Water",
    type: "movie",
    description: "Epic sci-fi adventure in stunning underwater worlds",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }

  const qualities = ['4K', 'HD', 'SD']

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

  // Attach media events
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = () => {
      setDuration(v.duration || 0)
      const saved = localStorage.getItem(`progress:${content.id}`)
      if (saved) {
        const t = parseFloat(saved)
        if (!isNaN(t)) v.currentTime = t
      }
    }
    const onTime = () => {
      setCurrentTime(v.currentTime)
      localStorage.setItem(`progress:${content.id}`, String(v.currentTime))
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('loadedmetadata', onLoaded)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [content.id])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          skipBackward()
          break
        case 'ArrowRight':
          skipForward()
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyF':
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play() } else { v.pause() }
    showControlsTemporarily()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
    showControlsTemporarily()
  }

  const skipBackward = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, v.currentTime - 10)
    showControlsTemporarily()
  }

  const skipForward = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(v.duration || duration, v.currentTime + 10)
    showControlsTemporarily()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (currentTime / duration) * 100

  return (
    <div className="min-h-screen bg-black">
      <Header credits={credits} userEmail={userEmail} />
      
      <div 
        ref={playerRef}
        className="relative bg-black"
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
            src={content.videoUrl}
            playsInline
            controls={false}
          />
          
          {/* Play/Pause Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {!isPlaying && (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            )}
          </div>

          {/* Controls Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-white mb-1">{content.title}</h1>
                <p className="text-white/80">{content.description}</p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div
                  className="relative h-1 bg-white/30 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
                    const v = videoRef.current
                    if (v && (v.duration || duration)) {
                      v.currentTime = ratio * (v.duration || duration)
                    }
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full"
                    style={{ left: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-white/80 text-sm mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 0)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={skipBackward}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <SkipBack className="w-6 h-6 text-white" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <SkipForward className="w-6 h-6 text-white" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${isMuted ? 0 : volume}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </button>
                    
                    {showSettings && (
                      <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                        <div className="space-y-3">
                          <div>
                            <p className="text-white font-medium mb-2">Quality</p>
                            <div className="space-y-1">
                              {qualities.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => setQuality(q)}
                                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    quality === q
                                      ? 'bg-red-600 text-white'
                                      : 'text-white/80 hover:bg-white/10'
                                  }`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
