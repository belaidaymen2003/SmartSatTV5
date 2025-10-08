"use client"

"use client"

import { useEffect, useState } from 'react'
import AdminStore from '../../../../lib/adminStore'

export default function AddSubscriptionPage() {
  const [channels, setChannels] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ userId: '', userEmail: '', userName: '', channelId: '', durationMonths: 1, credit: 0, code: '' })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/categories/category').then(r => r.json()).then((d) => setChannels(Array.isArray(d.channels) ? d.channels : []))
    // load admin store users (local seeded users)
    setUsers(AdminStore.getUsers())
  }, [])

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let s = ''
    for (let i = 0; i < 10; i++) s += chars.charAt(Math.floor(Math.random() * chars.length))
    setForm(f => ({ ...f, code: s }))
  }

  const submit = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const payload: any = {
        channelId: Number(form.channelId),
        durationMonths: Number(form.durationMonths),
      }
      if (typeof form.credit !== 'undefined') payload.credit = Number(form.credit)
      if (form.code) payload.code = form.code

      // Build Authorization header: prefer explicit form inputs, fallback to localStorage, then to a mock admin email
      let authToken = ''
      try {
        const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        if (form.userId) authToken = `Bearer ${form.userId}`
        else if (form.userEmail) authToken = `Bearer email:${form.userEmail}`
        else if (storedId) authToken = `Bearer ${storedId}`
        else if (storedEmail) authToken = `Bearer email:${storedEmail}`
        else authToken = `Bearer email:admin@local`
      } catch (e) { authToken = `Bearer email:admin@local` }

      const res = await fetch('/api/admin/categories/category/subscription', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authToken }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setMessage('Subscription created successfully')
      setForm({ userId: '', userEmail: '', userName: '', channelId: '', durationMonths: 1, credit: 0, code: '' })
    } catch (err: any) {
      setMessage(String(err.message || err))
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Create Subscription</h1>
      </div>

      <div className="bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm rounded-xl border border-white/8 p-6">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4" onSubmit={(e)=>{ e.preventDefault(); submit(); }}>
          <div className="md:col-span-6">
            <label className="text-sm text-white/70 block mb-1">Channel</label>
            <select value={form.channelId} onChange={(e)=>setForm({...form, channelId: e.target.value})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="">Select channel</option>
              {channels.map((c:any)=> (<option key={c.id} value={c.id}>{c.name} — {c.category || 'Live TV'}</option>))}
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70 block mb-1">Assign to existing user</label>
            <select value={form.userId} onChange={(e)=>{ setForm({...form, userId: e.target.value, userEmail: ''}) }} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="">Select a user (optional)</option>
              {users.map(u=> (<option key={u.id} value={u.id}>{u.name} — {u.email}</option>))}
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70 block mb-1">Or new user email</label>
            <input value={form.userEmail} onChange={(e)=>setForm({...form, userEmail: e.target.value, userId: ''})} placeholder="user@example.com" className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70 block mb-1">User name (optional)</label>
            <input value={form.userName} onChange={(e)=>setForm({...form, userName: e.target.value})} placeholder="Full name" className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70 block mb-1">Duration (months)</label>
            <select value={String(form.durationMonths)} onChange={(e)=>setForm({...form, durationMonths: Number(e.target.value)})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70 block mb-1">Price / Credit</label>
            <input type="number" value={form.credit} onChange={(e)=>setForm({...form, credit: Number(e.target.value)})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70 block mb-1">Code (optional)</label>
            <div className="mt-1 flex gap-2">
              <input value={form.code} onChange={(e)=>setForm({...form, code: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button type="button" onClick={generateCode} className="px-3 py-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6">Generate</button>
            </div>
          </div>

          <div className="md:col-span-12">
            <div className="flex items-center justify-end gap-2 mt-4">
              <button type="submit" disabled={loading || (!form.channelId)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold shadow">{loading ? 'Creating...' : 'Create Subscription'}</button>
            </div>
            {message && <div className="mt-3 text-sm text-white/80">{message}</div>}
          </div>
        </form>
      </div>
    </div>
  )
}
