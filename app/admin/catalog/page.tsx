"use client"

import { useMemo, useState } from 'react'
import { Search, Calendar, Filter, Eye, Edit2, Lock, Unlock, Trash2, Star, Plus } from 'lucide-react'
import Pagination from '../../../components/Admin/Pagination'

interface CatalogItem {
  id: number
  title: string
  rating: number
  category: 'Movie' | 'TV Series' | 'Anime' | 'Cartoon'
  views: number
  status: 'Visible' | 'Hidden'
  createdAt: string // ISO date
}

const seed: CatalogItem[] = [
  { id: 11, title: 'I Dream in Another Language', rating: 7.9, category: 'Movie', views: 1392, status: 'Visible', createdAt: '2023-02-05' },
  { id: 12, title: 'The Forgotten Road', rating: 7.1, category: 'Movie', views: 1093, status: 'Hidden', createdAt: '2023-02-05' },
  { id: 13, title: 'Whitney', rating: 6.3, category: 'TV Series', views: 723, status: 'Visible', createdAt: '2023-02-04' },
  { id: 14, title: 'Red Sky at Night', rating: 8.4, category: 'TV Series', views: 2457, status: 'Visible', createdAt: '2023-02-04' },
  { id: 15, title: 'Into the Unknown', rating: 7.9, category: 'Movie', views: 5092, status: 'Visible', createdAt: '2023-02-03' },
  { id: 16, title: 'The Unseen Journey', rating: 7.1, category: 'TV Series', views: 2713, status: 'Hidden', createdAt: '2023-02-03' },
  { id: 17, title: 'Savage Beauty', rating: 6.3, category: 'Cartoon', views: 901, status: 'Visible', createdAt: '2023-02-03' },
  { id: 18, title: 'Endless Horizon', rating: 8.4, category: 'Movie', views: 8430, status: 'Visible', createdAt: '2023-02-02' },
  { id: 19, title: 'The Lost Key', rating: 7.9, category: 'Movie', views: 818, status: 'Visible', createdAt: '2023-02-02' },
  { id: 20, title: 'Echoes of Yesterday', rating: 7.1, category: 'Anime', views: 1046, status: 'Hidden', createdAt: '2023-02-01' },
]

// Expand to multiple pages deterministically
const data: CatalogItem[] = Array.from({ length: 6 }).flatMap((_, i) =>
  seed.map((row) => ({ ...row, id: row.id + i * 20, title: i ? `${row.title} ${i+1}` : row.title }))
)

export default function AdminCatalogPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | 'Visible' | 'Hidden'>('All')
  const [sort, setSort] = useState<'date' | 'rating' | 'views' | 'title'>('date')
  const [page, setPage] = useState(2)
  const pageSize = 10

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = data.filter(r =>
      (status === 'All' || r.status === status) &&
      (!q || r.title.toLowerCase().includes(q))
    )
    rows = rows.sort((a,b) => {
      if (sort === 'date') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'views') return b.views - a.views
      return a.title.localeCompare(b.title)
    })
    return rows
  }, [query, status, sort])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const toggleStatus = (id: number) => {
    const idx = data.findIndex(r => r.id === id)
    if (idx >= 0) {
      data[idx].status = data[idx].status === 'Visible' ? 'Hidden' : 'Visible'
      setPage(page => page) // trigger rerender
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yyyy = d.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Catalog <span className="text-white/50 text-sm align-middle ml-2">{total} Total</span></h1>
        <button className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option value="date">Date created</option>
            <option value="rating">Rating</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/60" />
          <select value={status} onChange={e=>setStatus(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option>All</option>
            <option>Visible</option>
            <option>Hidden</option>
          </select>
        </div>
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find movie / tv series..." className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Views</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/70">{row.id}</td>
                  <td className="px-4 py-3 text-white hover:underline cursor-pointer">{row.title}</td>
                  <td className="px-4 py-3 text-yellow-400 font-medium flex items-center gap-1"><Star className="w-3 h-3" />{row.rating.toFixed(1)}</td>
                  <td className="px-4 py-3 text-white/80">{row.category}</td>
                  <td className="px-4 py-3 text-white/80">{row.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(row.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${row.status === 'Visible' ? 'text-green-400 border-green-500/40 bg-green-500/10' : 'text-white/70 border-white/20 bg-white/5'}`}>
                      {row.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Preview"><Eye className="w-4 h-4 text-white" /></button>
                      <button className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Edit"><Edit2 className="w-4 h-4 text-blue-300" /></button>
                      <button onClick={() => toggleStatus(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Toggle Visibility">
                        {row.status === 'Visible' ? <Lock className="w-4 h-4 text-yellow-300" /> : <Unlock className="w-4 h-4 text-green-300" />}
                      </button>
                      <button className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="text-xs text-white/50">{start + 1}–{Math.min(start + pageSize, total)} of {total}</div>
          <Pagination total={total} pageSize={pageSize} page={page} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
