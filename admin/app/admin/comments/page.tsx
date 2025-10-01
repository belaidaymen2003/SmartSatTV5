"use client"

import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Eye, CheckCircle2, EyeOff, Trash2, X } from 'lucide-react'
import AdminStore from '../../../lib/adminStore'
import type { AdminComment } from '../../../lib/adminStore'

export default function AdminCommentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | AdminComment['status']>('All')
  const [page, setPage] = useState(1)
  const [version, setVersion] = useState(0)
  const [active, setActive] = useState<AdminComment | null>(null)
  const pageSize = 10

  useEffect(() => { AdminStore.subscribe(() => setVersion((v) => v + 1)) }, [])

  const all = useMemo(() => AdminStore.getComments(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = all.filter((r) => (status === 'All' || r.status === status) && (!q || r.author.toLowerCase().includes(q) || r.itemTitle.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)))
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [all, query, status])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const approve = (id: number) => AdminStore.setCommentStatus(id, 'Approved')
  const hide = (id: number) => AdminStore.setCommentStatus(id, 'Hidden')
  const remove = (id: number) => { if (confirm('Delete comment?')) AdminStore.deleteComment(id) }

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Comments <span className="text-white/50 text-sm ml-2" suppressHydrationWarning>{total} Total</span></h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/60" />
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Hidden</option>
          </select>
        </div>
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search comments..." className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Content</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/70">{row.id}</td>
                  <td className="px-4 py-3 text-white hover:underline cursor-pointer" onClick={() => setActive(row)}>{row.itemTitle}</td>
                  <td className="px-4 py-3 text-white/80">{row.author}</td>
                  <td className="px-4 py-3 text-white/80 truncate max-w-[300px]">{row.content}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${row.status === 'Approved' ? 'text-green-400 border-green-500/40 bg-green-500/10' : row.status==='Hidden' ? 'text-white/70 border-white/20 bg-white/5' : 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10'}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setActive(row)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Preview"><Eye className="w-4 h-4 text-white" /></button>
                      {row.status !== 'Approved' && <button onClick={() => approve(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Approve"><CheckCircle2 className="w-4 h-4 text-emerald-300" /></button>}
                      {row.status !== 'Hidden' && <button onClick={() => hide(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Hide"><EyeOff className="w-4 h-4 text-yellow-300" /></button>}
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
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={() => setPage((p)=>p-1)} className="px-3 py-1.5 rounded-md border border-white/10 text-white/70 disabled:opacity-50">Prev</button>
            <button disabled={start + pageSize >= total} onClick={() => setPage((p)=>p+1)} className="px-3 py-1.5 rounded-md border border-white/10 text-white/70 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{active.itemTitle}</h3>
              <button className="p-1 hover:bg-white/10 rounded-md" onClick={() => setActive(null)}><X className="w-4 h-4 text-white/70" /></button>
            </div>
            <div className="text-white/80 text-sm space-y-2">
              <div>Author: {active.author}</div>
              <div>Status: {active.status}</div>
              <div>Created: {formatDate(active.createdAt)}</div>
              <div className="mt-2 p-3 rounded bg-white/5 text-white">{active.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
