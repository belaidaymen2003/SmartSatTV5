"use client"

import { useMemo, useState } from 'react'
import { Search, Calendar, Eye, Edit2, Trash2, User, UserPlus, ShieldCheck, Ban } from 'lucide-react'
import Pagination from '../../../components/Admin/Pagination'

interface AdminUser {
  id: number
  name: string
  email: string
  username: string
  plan: 'Free' | 'Basic' | 'Premium' | 'Cinematic'
  comments: number
  reviews: number
  status: 'Approved' | 'Banned'
  createdAt: string // ISO date
}

const seed: AdminUser[] = [
  { id: 11, name: 'Tess Harper', email: 'tess@example.com', username: 'tessharper', plan: 'Premium', comments: 13, reviews: 1, status: 'Approved', createdAt: '2023-02-05' },
  { id: 12, name: 'Gene Graham', email: 'gene@example.com', username: 'gene', plan: 'Free', comments: 1, reviews: 15, status: 'Approved', createdAt: '2023-02-05' },
  { id: 13, name: 'Rosa Lee', email: 'rosa@example.com', username: 'rosalee', plan: 'Premium', comments: 6, reviews: 6, status: 'Approved', createdAt: '2023-02-04' },
  { id: 14, name: 'Matt Jones', email: 'matt@example.com', username: 'mattj', plan: 'Free', comments: 11, reviews: 15, status: 'Banned', createdAt: '2023-02-04' },
  { id: 15, name: 'Brian Cranston', email: 'brian@example.com', username: 'bcranston', plan: 'Basic', comments: 0, reviews: 0, status: 'Approved', createdAt: '2023-02-04' },
  { id: 16, name: 'Louis Leterrier', email: 'louis@example.com', username: 'louis', plan: 'Free', comments: 2, reviews: 1, status: 'Approved', createdAt: '2023-02-03' },
  { id: 17, name: 'Son Gun', email: 'songun@example.com', username: 'songun', plan: 'Cinematic', comments: 65, reviews: 0, status: 'Approved', createdAt: '2023-02-02' },
  { id: 18, name: 'Jordana Brewster', email: 'jordana@example.com', username: 'jordana', plan: 'Premium', comments: 0, reviews: 0, status: 'Banned', createdAt: '2023-02-02' },
  { id: 19, name: 'Tyreese Gibson', email: 'tyreese@example.com', username: 'tyreese', plan: 'Premium', comments: 13, reviews: 1, status: 'Approved', createdAt: '2023-02-02' },
  { id: 20, name: 'Charlize Theron', email: 'charlize@example.com', username: 'charlize', plan: 'Free', comments: 1, reviews: 15, status: 'Banned', createdAt: '2023-02-01' },
]

// Expand deterministically to multiple pages
const data: AdminUser[] = Array.from({ length: 17 }).flatMap((_, i) =>
  seed.map((row) => ({
    ...row,
    id: row.id + i * 10,
    name: i ? `${row.name} ${i + 1}` : row.name,
    username: i ? `${row.username}${i + 1}` : row.username,
  }))
)

export default function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'date' | 'comments' | 'reviews' | 'name'>('date')
  const [page, setPage] = useState(2)
  const pageSize = 10

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = data.filter((r) =>
      !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.username.toLowerCase().includes(q)
    )
    rows = rows.sort((a, b) => {
      if (sort === 'date') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'comments') return b.comments - a.comments
      if (sort === 'reviews') return b.reviews - a.reviews
      return a.name.localeCompare(b.name)
    })
    return rows
  }, [query, sort])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  const toggleStatus = (id: number) => {
    const idx = data.findIndex((r) => r.id === id)
    if (idx >= 0) {
      data[idx].status = data[idx].status === 'Approved' ? 'Banned' : 'Approved'
      setPage((p) => p)
    }
  }

  const removeUser = (id: number) => {
    const idx = data.findIndex((r) => r.id === id)
    if (idx >= 0) {
      data.splice(idx, 1)
      setPage((p) => Math.min(p, Math.max(1, Math.ceil(data.length / pageSize))))
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Users <span className="text-white/50 text-sm align-middle ml-2">{total.toLocaleString()} Total</span></h1>
        <button className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          ADD USER
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="bg-transparent text-white/80 text-sm focus:outline-none">
            <option value="date">Date created</option>
            <option value="comments">Comments</option>
            <option value="reviews">Reviews</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find user..." className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none" />
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Basic info</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Pricing plan</th>
                <th className="px-4 py-3 text-left">Comments</th>
                <th className="px-4 py-3 text-left">Reviews</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/70">{row.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-white/70">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{row.name}</div>
                        <div className="text-xs text-white/50">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/80">{row.username}</td>
                  <td className="px-4 py-3 text-white/80">{row.plan}</td>
                  <td className="px-4 py-3 text-white/80">{row.comments}</td>
                  <td className="px-4 py-3 text-white/80">{row.reviews}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${row.status === 'Approved' ? 'text-green-400' : 'text-red-400'}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Preview"><Eye className="w-4 h-4 text-white" /></button>
                      <button className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Edit"><Edit2 className="w-4 h-4 text-blue-300" /></button>
                      <button onClick={() => toggleStatus(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Toggle Status">
                        {row.status === 'Approved' ? <Ban className="w-4 h-4 text-yellow-300" /> : <ShieldCheck className="w-4 h-4 text-green-300" />}
                      </button>
                      <button onClick={() => removeUser(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
