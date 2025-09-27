'use client'

import { Play, Tv, Film, Radio, Gamepad2, Wifi } from 'lucide-react'

export default function Loading3D() {
  return (
    <div className="loader-3d loader-center" aria-hidden>
      <div className="cube">
        <div className="front flex items-center justify-center text-white">
          <Play className="w-8 h-8" />
        </div>
        <div className="back flex items-center justify-center text-white">
          <Tv className="w-8 h-8" />
        </div>
        <div className="right flex items-center justify-center text-white">
          <Film className="w-8 h-8" />
        </div>
        <div className="left flex items-center justify-center text-white">
          <Radio className="w-8 h-8" />
        </div>
        <div className="top flex items-center justify-center text-white">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <div className="bottom flex items-center justify-center text-white">
          <Wifi className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}
