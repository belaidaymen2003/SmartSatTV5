'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GiftCardsPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<{ id: number, title: string, description: string | null, coverUrl: string | null }[]>([])
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState<{ id: number, title: string, description: string | null, coverUrl: string | null } | null>(null)
  const [form, setForm] = useState({ title: '', description: '', coverUrl: '' })
  const pageSize = 12
  const [page, setPage] = useState(1)

  const fetchGiftCards = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gift-cards', { cache: 'no-store' })
      let data: any = {}
      try { data = await res.clone().json() } catch {}
      setItems(Array.isArray(data.items) ? data.items : [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchGiftCards() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((g) => !q || g.title.toLowerCase().includes(q))
  }, [items, query])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">GIFT CARDS <span className="text-white/50 text-sm ml-2" suppressHydrationWarning>{total} Total</span></h1>
        <button onClick={()=>router.push('/admin/categories/add/gift-cards')} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search in GIFT CARDS...`} className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="text-white/60">No gift cards</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((g) => (
              <div key={g.id} className="bg-black/30 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {g.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.coverUrl} alt={g.title} className="h-full w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{g.title}</div>
                    {g.description && <div className="text-xs text-white/50 mt-1 line-clamp-2">{g.description}</div>}
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEdit(g)} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/10 hover:bg-white/10 text-white/80">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={async () => { if(confirm('Delete?')) { await fetch(`/api/admin/gift-cards?id=${g.id}`, { method: 'DELETE' }); fetchGiftCards() } }} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10">
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

      {edit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Edit Gift Card</h3>
              <button onClick={() => setEdit(null)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5 text-white/70" /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-white/70">Title<input className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.title || edit.title} onChange={(e)=>setForm({...form, title: e.target.value})} /></label>
              <label className="text-sm text-white/70">Description<textarea className="mt-1 w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" value={form.description || edit.description || ''} onChange={(e)=>setForm({...form, description: e.target.value})} /></label>
              <div className="text-sm text-white/70">
                Image
                <div className="mt-2 flex items-center gap-3">
                  {edit.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={edit.coverUrl} alt={edit.title} className="h-10 w-10 rounded bg-white/10 object-contain" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-white/10 grid place-items-center"><ImageIcon className="w-5 h-5 text-white/40" /></div>
                  )}
                  <label className="px-3 py-1.5 border border-white/10 rounded cursor-pointer hover:bg-white/10 text-white/80">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{ const f=e.target.files?.[0]; if(!f||!edit) return; const fd = new FormData(); fd.append('itemId', String(edit.id)); fd.append('file', f); fd.append('fileName', f.name); if (edit.coverUrl) fd.append('oldUrl', edit.coverUrl); await fetch('/api/admin/gift-cards/upload', { method: 'PUT', body: fd }); fetchGiftCards(); }} />
                  </label>
                  {edit.coverUrl && (
                    <button type="button" onClick={async()=>{ if(!edit) return; await fetch('/api/admin/gift-cards/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: edit.id }) }); fetchGiftCards(); }} className="px-3 py-1.5 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10">Remove</button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEdit(null)} className="px-4 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">Cancel</button>
              <button onClick={async()=>{ if(!edit) return; await fetch('/api/admin/gift-cards', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: edit.id, ...form }) }); setEdit(null); setForm({ title: '', description: '', coverUrl: '' }); fetchGiftCards(); }} className="px-4 py-2 rounded border border-orange-500 text-orange-400 hover:bg-orange-500/10">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
