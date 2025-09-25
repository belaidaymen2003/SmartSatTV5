"use client"

import { useEffect, useMemo, useState } from 'react'
import { Search, Calendar, Filter, Eye, Edit2, Lock, Unlock, Trash2, Star, Plus, X } from 'lucide-react'
import Pagination from '../../../components/Admin/Pagination'
import AdminStore from '../../../lib/adminStore'
import type { CatalogItem } from '../../../lib/adminStore'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminCatalogPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | 'Visible' | 'Hidden'>('All')
  const [sort, setSort] = useState<'date' | 'rating' | 'views' | 'title'>('date')
  const [page, setPage] = useState(2)
  const [version, setVersion] = useState(0)
  const [active, setActive] = useState<CatalogItem | null>(null)
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Partial<CatalogItem> } | null>(null)
  const pageSize = 10
  const search = useSearchParams()

  useEffect(() => AdminStore.subscribe(() => setVersion((v) => v + 1)), [])

  const all = useMemo(() => AdminStore.getCatalog(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = all.filter((r) => (status === 'All' || r.status === status) && (!q || r.title.toLowerCase().includes(q)))
    rows = rows.sort((a, b) => {
      if (sort === 'date') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'views') return b.views - a.views
      return a.title.localeCompare(b.title)
    })
    return rows
  }, [all, query, status, sort])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const toggleStatus = (id: number) => AdminStore.toggleItemStatus(id)
  const remove = (id: number) => { if (confirm('Delete this item?')) AdminStore.deleteItem(id) }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  }

  const openAdd = () => setModal({ mode: 'add', data: { title: '', rating: 7, category: 'Movie', views: 0, status: 'Visible', mediaUrl: '' } })

  useEffect(() => {
    if (search.get('add') === '1') {
      openAdd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  const openEdit = (it: CatalogItem) => setModal({ mode: 'edit', data: { ...it } })

  const save = () => {
    if (!modal) return
    const d = modal.data
    if (!d.title || d.rating == null || d.category == null || d.status == null) return
    const item = {
      title: String(d.title),
      rating: Math.min(10, Math.max(0, Number(d.rating))),
      category: d.category as CatalogItem['category'],
      views: Math.max(0, Number(d.views ?? 0)),
      status: d.status as CatalogItem['status'],
      mediaUrl: (d.mediaUrl as string) || undefined,
    }
    if (modal.mode === 'add') AdminStore.addItem(item)
    else if (typeof d.id === 'number') AdminStore.updateItem(d.id, item)
    setModal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Catalog <span className="text-white/50 text-sm align-middle ml-2">{total} Total</span></h1>
        <button onClick={() => router.push('/admin/catalog/add')} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option value="date">Date created</option>
            <option value="rating">Rating</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/60" />
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option>All</option>
            <option>Visible</option>
            <option>Hidden</option>
          </select>
        </div>
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find movie / tv series..." className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
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
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/70">{row.id}</td>
                  <td className="px-4 py-3 text-white hover:underline cursor-pointer" onClick={() => setActive(row)}>{row.title}</td>
                  <td className="px-4 py-3 text-yellow-400 font-medium flex items-center gap-1"><Star className="w-3 h-3" />{row.rating.toFixed(1)}</td>
                  <td className="px-4 py-3 text-white/80">
                    <span className="inline-flex items-center gap-2">
                      {row.category}
                      {row.category === 'Live TV' && <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/20 text-red-300 border border-red-500/30">LIVE</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80">{row.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(row.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${row.status === 'Visible' ? 'text-green-400 border-green-500/40 bg-green-500/10' : 'text-white/70 border-white/20 bg-white/5'}`}>{row.status}</button>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setActive(row)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Preview"><Eye className="w-4 h-4 text-white" /></button>
                      <button onClick={() => openEdit(row)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Edit"><Edit2 className="w-4 h-4 text-blue-300" /></button>
                      <button onClick={() => toggleStatus(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Toggle Visibility">{row.status === 'Visible' ? <Lock className="w-4 h-4 text-yellow-300" /> : <Unlock className="w-4 h-4 text-green-300" />}</button>
                      <button onClick={() => remove(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
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

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{active.title}</h3>
              <button className="p-1 hover:bg-white/10 rounded-md" onClick={() => setActive(null)}><X className="w-4 h-4 text-white/70" /></button>
            </div>
            <div className="text-white/80 text-sm space-y-2">
              <div>Category: {active.category}</div>
              <div>Rating: {active.rating}</div>
              <div>Views: {active.views.toLocaleString()}</div>
              {active.mediaUrl && <div className="truncate">Source: {active.mediaUrl}</div>}
              <div>Status: {active.status}</div>
              <div>Created: {formatDate(active.createdAt)}</div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{modal.mode === 'add' ? 'Add item' : 'Edit item'}</h3>
              <button className="p-1 hover:bg-white/10 rounded-md" onClick={() => setModal(null)}><X className="w-4 h-4 text-white/70" /></button>
            </div>
            <div className="grid gap-3 text-sm">
              <input value={modal.data.title as any} onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })} placeholder="Title" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              <div className="grid grid-cols-2 gap-3">
                <input value={modal.data.rating as any} onChange={(e) => setModal({ ...modal, data: { ...modal.data, rating: Number(e.target.value) } })} type="number" step="0.1" min={0} max={10} placeholder="Rating" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
                <input value={modal.data.views as any} onChange={(e) => setModal({ ...modal, data: { ...modal.data, views: Number(e.target.value) } })} type="number" min={0} placeholder="Views" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={modal.data.category as any} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value as any } })} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Movie</option>
                  <option>TV Series</option>
                  <option>Anime</option>
                  <option>Cartoon</option>
                  <option>Live TV</option>
                  <option>Streaming</option>
                </select>
                <select value={modal.data.status as any} onChange={(e) => setModal({ ...modal, data: { ...modal.data, status: e.target.value as any } })} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Visible</option>
                  <option>Hidden</option>
                </select>
              </div>
              {(modal.data.category === 'Live TV' || modal.data.category === 'Streaming') && (
                <input value={(modal.data.mediaUrl as any) ?? ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, mediaUrl: e.target.value } })} placeholder="Stream URL (HLS .m3u8 / DASH .mpd)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              )}
              {modal.data.category !== 'Live TV' && modal.data.category !== 'Streaming' && (
                <input value={(modal.data.mediaUrl as any) ?? ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, mediaUrl: e.target.value } })} placeholder="Video URL (mp4/hls)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              )}
              <div className="flex items-center justify-end gap-2 mt-1">
                <button onClick={() => setModal(null)} className="px-3 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/10">Cancel</button>
                <button onClick={save} className="px-3 py-2 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500/10">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
