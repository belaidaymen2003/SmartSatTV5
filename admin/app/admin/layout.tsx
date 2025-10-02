'use client'

import { useState } from 'react'
import Sidebar from '../../components/Admin/Sidebar'
import { Menu } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className=" md:flex justify-between min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur border-b border-white/10">
        <button aria-label="Open menu" className="p-2 rounded-md bg-white/10" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm font-semibold">Admin</div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <Sidebar className="z-50" />
        </div>
      )}

      <main className=" ml-0 p-4 md:p-8 h-screen flex-1 overflow-y-auto">
        <div className=" mx-auto">{children}</div>
      </main>
    </div>
  )
}
