'use client'

type Props = { params: { slug: string } }

import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminStore from '../../../../lib/adminStore'
import type { CatalogItem } from '../../../../lib/adminStore'

// Server model shape for IPTVChannel
type IPTVChannel = {
  id: number
  name: string
  url: string
  logo: string | null
  description: string | null
  category: string | null
  cost: number
  createdAt: string
  updatedAt: string
}

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
  const pageSize = 12
  const [page, setPage] = useState(1)

  // Catalog (non-IPTV) local store subscription
  useEffect(() => { AdminStore.subscribe(() => setVersion((v)=>v+1)) }, [])
  const all = useMemo(() => AdminStore.getCatalog(), [version])

  // IPTV Channels state
  const [channels, setChannels] = useState<IPTVChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState<IPTVChannel | null>(null)
  const [form, setForm] = useState({ name: '', url: '', logo: '', description: '', category: 'Live TV', cost: 0 })

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/category?slug=iptv`)
      const data = await res.json()
      setChannels(Array.isArray(data.channels) ? data.channels : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.slug === 'iptv') {
      fetchChannels()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug])

  const filteredCatalog = useMemo(() => {
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

  const filteredChannels = useMemo(() => {
    const q = query.trim().toLowerCase()
    return channels.filter((c) => !q || c.name.toLowerCase().includes(q))
  }, [channels, query])

  const total = params.slug === 'iptv' ? filteredChannels.length : filteredCatalog.length
  const start = (page - 1) * pageSize
  const rows = params.slug === 'iptv' ? filteredChannels.slice(start, start + pageSize) : filteredCatalog.slice(start, start + pageSize)

  const onAdd = () => {
    const map = categoryMapping(params.slug)
    const qs = new URLSearchParams()
    if (map.category) qs.set('category', map.category)
    if (map.genre) qs.set('genre', map.genre)
    router.push(`/admin/categories/${params.slug}/add?${qs.toString()}`)
  }

  const openEdit = (ch: IPTVChannel) => {
    setEdit(ch)
    setForm({
      name: ch.name || '',
      url: ch.url || '',
      logo: ch.logo || '',
      description: ch.description || '',
      category: ch.category || 'Live TV',
      cost: Number(ch.cost || 0),
    })
  }

  const saveEdit = async () => {
    if (!edit) return
    const payload = { id: edit.id, ...form }
    await fetch('/api/admin/categories/category', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setEdit(null)
    fetchChannels()
  }

  const removeChannel = async (id: number) => {
    if (!confirm('Delete this channel?')) return
    await fetch(`/api/admin/categories/category?id=${id}`, { method: 'DELETE' })
    fetchChannels()
  }

  const replaceLogo = async (file: File) => {
    if (!edit) return
    const fd = new FormData()
    fd.append('channelId', String(edit.id))
    fd.append('file', file)
    fd.append('fileName', file.name)
    if (edit.logo) fd.append('oldLogoUrl', edit.logo)
    await fetch('/api/admin/categories/upload', { method: 'PUT', body: fd })
      .then((r)=>r.json())
      .then((d)=>{
        if (d.logoUrl) setForm((f)=>({ ...f, logo: d.logoUrl }))
      })
    fetchChannels()
  }

  const deleteLogo = async () => {
    if (!edit) return
    await fetch('/api/admin/categories/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: edit.id, logoUrl: edit.logo || undefined })
    })
    setForm((f)=>({ ...f, logo: '' }))
    fetchChannels()
  }

  const currency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)

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

      {params.slug === 'iptv' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-white/60">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-white/60">No channels</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rows.map((ch) => (
                <div key={ch.id} className="bg-black/30 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                      {ch.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ch.logo} alt={ch.name} className="h-full w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{ch.name}</div>
                      <div className="text-xs text-white/60 mt-0.5">{ch.category || 'Live TV'}</div>
                      {ch.description && <div className="text-xs text-white/50 mt-1 line-clamp-2">{ch.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-white/60">{currency(ch.cost)}</div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(ch)} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/10 hover:bg-white/10 text-white/80">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => removeChannel(ch.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between p-1">
            <div className="text-white/60 text-xs">Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p)=>Math.max(1, p-1))} className="px-3 py-1 rounded border border-white/10 disabled:opacity-50">Prev</button>
              <button disabled={start + pageSize >= total} onClick={() => setPage((p)=>p+1)} className="px-3 py-1 rounded border border-white/10 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black/20 h-96 backdrop-blur-sm rounded-xl border border-white/10"></div>
      )}

      {/* Edit modal */}
      {edit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Edit Channel</h3>
              <button onClick={() => setEdit(null)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5 text-white/70" /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-white/70">Name<input className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></label>
              <label className="text-sm text-white/70">URL<input className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.url} onChange={(e)=>setForm({...form, url: e.target.value})} /></label>
              <label className="text-sm text-white/70">Description<textarea className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} /></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm text-white/70">Category<input className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} /></label>
                <label className="text-sm text-white/70">Cost<input type="number" step="0.01" className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.cost} onChange={(e)=>setForm({...form, cost: Number(e.target.value)})} /></label>
              </div>
              <div className="text-sm text-white/70">
                Logo
                <div className="mt-2 flex items-center gap-3">
                  {form.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.logo} alt={form.name} className="h-10 w-10 rounded bg-white/10 object-contain" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-white/10 grid place-items-center"><ImageIcon className="w-5 h-5 text-white/40" /></div>
                  )}
                  <label className="px-3 py-1.5 border border-white/10 rounded cursor-pointer hover:bg-white/10 text-white/80">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) replaceLogo(f) }} />
                  </label>
                  {form.logo && (
                    <button type="button" onClick={deleteLogo} className="px-3 py-1.5 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10">Remove</button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEdit(null)} className="px-4 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 rounded border border-orange-500 text-orange-400 hover:bg-orange-500/10">Save</button>
            </div>
          </div>
        </div>
      )}

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
              <div>Created: {(() => { const [y, m, d] = active.createdAt.split('-').map(Number); return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}` })()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
