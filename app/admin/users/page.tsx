"use client"

import { useEffect, useMemo, useState } from 'react'
import { Search, Calendar, Eye, Edit2, Trash2, User, UserPlus, ShieldCheck, Ban, Coins, Plus, Pencil, X } from 'lucide-react'
import Pagination from '../../../components/Admin/Pagination'
import AdminStore from '../../../lib/adminStore'
import type { AdminUser } from '../../../lib/adminStore'
import { useSearchParams } from 'next/navigation'

export default function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'date' | 'comments' | 'reviews' | 'name'>('date')
  const [page, setPage] = useState(2)
  const [creditModal, setCreditModal] = useState<{ id: number; mode: 'add' | 'edit' } | null>(null)
  const [creditAmount, setCreditAmount] = useState<string>('')
  const [version, setVersion] = useState(0)
  const [active, setActive] = useState<AdminUser | null>(null)
  const [userModal, setUserModal] = useState<{ mode: 'add' | 'edit'; data: Partial<AdminUser> } | null>(null)
  const pageSize = 10
  const search = useSearchParams()

  useEffect(() => AdminStore.subscribe(() => setVersion((v) => v + 1)), [])

  const all = useMemo(() => AdminStore.getUsers(), [version])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = all.filter((r) => !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.username.toLowerCase().includes(q))
    rows = rows.sort((a, b) => {
      if (sort === 'date') return b.createdAt.localeCompare(a.createdAt)
      if (sort === 'comments') return b.comments - a.comments
      if (sort === 'reviews') return b.reviews - a.reviews
      return a.name.localeCompare(b.name)
    })
    return rows
  }, [all, query, sort])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)
  const nf = new Intl.NumberFormat('en-US')

  const toggleStatus = (id: number) => AdminStore.toggleUserStatus(id)
  const removeUser = (id: number) => { if (confirm('Delete this user?')) AdminStore.deleteUser(id) }

  const addCredits = (id: number, amount: number) => AdminStore.addCredits(id, amount)
  const setCredits = (id: number, amount: number) => AdminStore.setCredits(id, amount)
  const deleteCredits = (id: number) => AdminStore.resetCredits(id)

  const openAddCredits = (id: number) => { setCreditAmount(''); setCreditModal({ id, mode: 'add' }) }
  const openEditCredits = (id: number, current: number) => { setCreditAmount(String(current)); setCreditModal({ id, mode: 'edit' }) }

  const saveCredits = () => {
    if (!creditModal) return
    const value = Number(creditAmount)
    if (Number.isNaN(value)) return
    if (creditModal.mode === 'add') addCredits(creditModal.id, value)
    else setCredits(creditModal.id, value)
    setCreditModal(null)
  }

  const openAddUser = () => setUserModal({ mode: 'add', data: { name: '', email: '', username: '', plan: 'Free', comments: 0, reviews: 0, credits: 0, status: 'Approved' } })

  useEffect(() => {
    if (search.get('add') === '1') {
      openAddUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  const openEditUser = (u: AdminUser) => setUserModal({ mode: 'edit', data: { ...u } })

  const saveUser = () => {
    if (!userModal) return
    const d = userModal.data
    if (!d.name || !d.email || !d.username || !d.plan || !d.status) return
    const payload = {
      name: String(d.name),
      email: String(d.email),
      username: String(d.username),
      plan: d.plan as AdminUser['plan'],
      comments: Number(d.comments ?? 0),
      reviews: Number(d.reviews ?? 0),
      credits: Math.max(0, Number(d.credits ?? 0)),
      status: d.status as AdminUser['status'],
    }
    if (userModal.mode === 'add') AdminStore.addUser(payload)
    else if (typeof d.id === 'number') AdminStore.updateUser(d.id, payload)
    setUserModal(null)
  }

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    const dd = String(d).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const yyyy = y
    return `${dd}.${mm}.${yyyy}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Users <span suppressHydrationWarning className="text-white/50 text-sm align-middle ml-2">{new Intl.NumberFormat('en-US').format(total)} Total</span></h1>
        <button onClick={openAddUser} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
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
                <th className="px-4 py-3 text-left">Credits</th>
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
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 inline-flex items-center gap-1">
                        <Coins className="w-3 h-3" /> {nf.format(row.credits)}
                      </span>
                      <button onClick={() => openAddCredits(row.id)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10" aria-label="Add credits"><Plus className="w-3.5 h-3.5 text-green-300" /></button>
                      <button onClick={() => openEditCredits(row.id, row.credits)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10" aria-label="Edit credits"><Pencil className="w-3.5 h-3.5 text-blue-300" /></button>
                      <button onClick={() => { if (confirm('Reset credits to 0?')) deleteCredits(row.id) }} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete credits"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${row.status === 'Approved' ? 'text-green-400' : 'text-red-400'}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setActive(row)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Preview"><Eye className="w-4 h-4 text-white" /></button>
                      <button onClick={() => openEditUser(row)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Edit user"><Edit2 className="w-4 h-4 text-blue-300" /></button>
                      <button onClick={() => toggleStatus(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Toggle Status">
                        {row.status === 'Approved' ? <Ban className="w-4 h-4 text-yellow-300" /> : <ShieldCheck className="w-4 h-4 text-green-300" />}
                      </button>
                      <button onClick={() => removeUser(row.id)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete user"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
              <h3 className="text-white font-semibold">{active.name}</h3>
              <button className="p-1 hover:bg-white/10 rounded-md" onClick={() => setActive(null)}><X className="w-4 h-4 text-white/70" /></button>
            </div>
            <div className="text-white/80 text-sm space-y-2">
              <div>Email: {active.email}</div>
              <div>Username: {active.username}</div>
              <div>Plan: {active.plan}</div>
              <div>Credits: {active.credits.toLocaleString()}</div>
              <div>Status: {active.status}</div>
              <div>Joined: {formatDate(active.createdAt)}</div>
            </div>
          </div>
        </div>
      )}

      {userModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setUserModal(null)}>
          <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{userModal.mode === 'add' ? 'Add user' : 'Edit user'}</h3>
              <button className="p-1 hover:bg-white/10 rounded-md" onClick={() => setUserModal(null)}><X className="w-4 h-4 text-white/70" /></button>
            </div>
            <div className="grid gap-3 text-sm">
              <input value={(userModal.data.name as any) ?? ''} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, name: e.target.value } })} placeholder="Full name" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              <input value={(userModal.data.email as any) ?? ''} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, email: e.target.value } })} placeholder="Email" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              <input value={(userModal.data.username as any) ?? ''} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, username: e.target.value } })} placeholder="Username" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              <div className="grid grid-cols-2 gap-3">
                <select value={(userModal.data.plan as any) ?? 'Free'} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, plan: e.target.value as any } })} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Free</option>
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Cinematic</option>
                </select>
                <select value={(userModal.data.status as any) ?? 'Approved'} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, status: e.target.value as any } })} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Approved</option>
                  <option>Banned</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={(userModal.data.comments as any) ?? 0} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, comments: Number(e.target.value) } })} type="number" min={0} placeholder="Comments" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
                <input value={(userModal.data.reviews as any) ?? 0} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, reviews: Number(e.target.value) } })} type="number" min={0} placeholder="Reviews" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              </div>
              <input value={(userModal.data.credits as any) ?? 0} onChange={(e) => setUserModal({ ...userModal, data: { ...userModal.data, credits: Number(e.target.value) } })} type="number" min={0} placeholder="Credits" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
              <div className="flex items-center justify-end gap-2 mt-1">
                <button onClick={() => setUserModal(null)} className="px-3 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/10">Cancel</button>
                <button onClick={saveUser} className="px-3 py-2 rounded-md border border-orange-500 text-orange-400 hover:bg-orange-500/10">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {creditModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-black/30 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-300" />
              {creditModal.mode === 'add' ? 'Add credits' : 'Set credits'}
            </h3>
            <p className="text-xs text-white/60 mb-4">{creditModal.mode === 'add' ? 'Increase user balance by amount' : 'Replace user balance with amount'}</p>
            <input
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Amount"
              inputMode="numeric"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setCreditModal(null)} className="px-3 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/10">Cancel</button>
              <button onClick={saveCredits} className="px-3 py-2 rounded-md border border-yellow-500 text-yellow-300 hover:bg-yellow-500/10">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
