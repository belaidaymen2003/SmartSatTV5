'use client'

import { ReactNode } from 'react'

export default function StatsCard({ title, value, change, icon }:{ title:string, value:string | number, change?:string, icon?:ReactNode }) {
  const isPositive = change && (change.includes('+') || !change.includes('-'))
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'

  return (
    <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {change && <div className={`mt-2 text-sm font-medium ${changeColor}`}>{change}</div>}
        </div>
        {icon && <div className="text-orange-400 opacity-80">{icon}</div>}
      </div>
    </div>
  )
}
