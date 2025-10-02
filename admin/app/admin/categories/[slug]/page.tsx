"use client"

type Props = { params: { slug: string } }

import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Star, Eye, Edit2, Lock, Unlock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminStore from '../../../../lib/adminStore'
import type { CatalogItem } from '../../../../lib/adminStore'

const titleFromSlug = (slug: string) => {
  const map: Record<string, string> = {
    'iptv': 'IPTV',
    'gift-cards': 'GIFT CARDS',
    'bein-sports': 'beIN SPORTS',
    'goosat': 'Goosat',
    'carte-internet': 'CARTE INTERNET',
    'streaming': 'Streaming',
  }
  return map[slug] ?? slug.replace(/-/g, ' ')
}

const categoryMapping = (slug: string): { category?: CatalogItem['category']; genre?: string } => {
  if (slug === 'iptv') return { category: 'Live TV' }
  if (slug === 'streaming') return { category: 'Streaming' }
  if (slug === 'gift-cards') return { genre: 'GIFT CARDS' }
  if (slug === 'bein-sports') return { genre: 'beIN SPORTS' }
  if (slug === 'goosat') return { genre: 'Goosat' }
  if (slug === 'carte-internet') return { genre: 'CARTE INTERNET' }
  return {}
}

export default function CategoryPage({ params }: Props) {
  const router = useRouter()
  const title = titleFromSlug(params.slug)
  const [query, setQuery] = useState('')
  const [version, setVersion] = useState(0)
  const [active, setActive] = useState<CatalogItem | null>(null)
  const pageSize = 10
  const [page, setPage] = useState(1)

  useEffect(() => { AdminStore.subscribe(() => setVersion((v)=>v+1)) }, [])

  const all = useMemo(() => AdminStore.getCatalog(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = categoryMapping(params.slug)
    let rows = all.filter((r) => {
      const matchesQuery = !q || r.title.toLowerCase().includes(q)
      const matchByCategory = map.category ? r.category === map.category : true
      const matchByGenre = map.genre ? (r.genres || []).map((g)=>g.toLowerCase()).includes(map.genre.toLowerCase()) : true
      return matchesQuery && matchByCategory && matchByGenre
    })
    return rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
  }, [all, query, params.slug])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const toggleStatus = (id: number) => AdminStore.toggleItemStatus(id)

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`
  }

  const onAdd = () => {
    const map = categoryMapping(params.slug)
    const qs = new URLSearchParams()
    if (map.category) qs.set('category', map.category)
    if (map.genre) qs.set('genre', map.genre)
    router.push(`/admin/categories/${params.slug}/add?${qs.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title} <span className="text-white/50 text-sm ml-2" suppressHydrationWarning>{total} Total</span></h1>
        <button onClick={onAdd} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search in ${title}...`} className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="bg-black/20 h-96 backdrop-blur-sm rounded-xl border border-white/10">
    
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{active.title}</h3>
            </div>
            <div className="text-white/80 text-sm space-y-2">
              <div>Category: {active.category}</div>
              <div>Rating: {active.rating}</div>
              <div>Views: {new Intl.NumberFormat('en-US').format(active.views)}</div>
              {active.mediaUrl && <div className="truncate">Source: {active.mediaUrl}</div>}
              <div>Status: {active.status}</div>
              <div>Created: {formatDate(active.createdAt)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
