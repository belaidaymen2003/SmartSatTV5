"use client"

import { useEffect, useMemo, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminStore from '../../../../lib/adminStore'
import type { CatalogItem } from '../../../../lib/adminStore'

const SLUG = 'gift-cards'
const TITLE = 'GIFT CARDS'

export default function GiftCardsPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [version, setVersion] = useState(0)
  const [active, setActive] = useState<CatalogItem | null>(null)
  const pageSize = 10
  const [page, setPage] = useState(1)

  useEffect(() => { AdminStore.subscribe(() => setVersion((v)=>v+1)) }, [])

  const all = useMemo(() => AdminStore.getCatalog(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = { genre: 'GIFT CARDS' } as const
    let rows = all.filter((r) => {
      const matchesQuery = !q || r.title.toLowerCase().includes(q)
      const matchByCategory = map.category ? r.category === map.category : true
      const matchByGenre = map.genre ? (r.genres || []).map((g)=>g.toLowerCase()).includes(map.genre.toLowerCase()) : true
      return matchesQuery && matchByCategory && matchByGenre
    })
    return rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
  }, [all, query])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`
  }

  const onAdd = () => {
    const qs = new URLSearchParams()
    qs.set('genre', 'GIFT CARDS')
    router.push(`/admin/categories/add/${SLUG}?${qs.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{TITLE} <span className="text-white/50 text-sm ml-2">{total} Total</span></h1>
        <button onClick={onAdd} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search in ${TITLE}...`} className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="bg-black/20 h-96 backdrop-blur-sm rounded-xl border border-white/10 p-4 overflow-auto">
        {rows.length === 0 ? (
          <div className="text-white/50">No items found in {TITLE}.</div>
        ) : (
          <div className="grid gap-3">
            {rows.map((it) => (
              <div key={it.id} className="p-3 bg-black/30 border border-white/5 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{it.title}</div>
                  <div className="text-white/60 text-sm">{it.category} • {formatDate(it.createdAt)}</div>
                </div>
                <div className="text-white/80 text-sm">{it.views} views</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold">{active.title}</h3>
            <div className="text-white/80 text-sm mt-2">
              <div>Category: {active.category}</div>
              <div>Rating: {active.rating}</div>
              <div>Views: {active.views}</div>
              <div>Created: {formatDate(active.createdAt)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
