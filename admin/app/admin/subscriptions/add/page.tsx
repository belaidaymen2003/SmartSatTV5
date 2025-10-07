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

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="text-sm text-white/70">Channel
              <select value={form.channelId} onChange={(e)=>setForm({...form, channelId: e.target.value})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value="">Select channel</option>
                {channels.map((c:any)=> (<option key={c.id} value={c.id}>{c.name} — {c.category || 'Live TV'}</option>))}
              </select>
            </label>
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">Assign to existing user
              <select value={form.userId} onChange={(e)=>{ setForm({...form, userId: e.target.value, userEmail: ''}) }} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value="">Select a user (optional)</option>
                {users.map(u=> (<option key={u.id} value={u.id}>{u.name} — {u.email}</option>))}
              </select>
            </label>
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">Or new user email
              <input value={form.userEmail} onChange={(e)=>setForm({...form, userEmail: e.target.value, userId: ''})} placeholder="user@example.com" className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </label>
          </div>

          <div className="md:col-span-6">
            <label className="text-sm text-white/70">User name (optional)
              <input value={form.userName} onChange={(e)=>setForm({...form, userName: e.target.value})} placeholder="Full name" className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </label>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Duration (months)
              <select value={String(form.durationMonths)} onChange={(e)=>setForm({...form, durationMonths: Number(e.target.value)})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </label>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Price / Credit
              <input type="number" value={form.credit} onChange={(e)=>setForm({...form, credit: Number(e.target.value)})} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </label>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-white/70">Code (optional)
              <div className="mt-1 flex gap-2">
                <input value={form.code} onChange={(e)=>setForm({...form, code: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
                <button type="button" onClick={generateCode} className="px-3 py-2 rounded border border-white/10">Generate</button>
              </div>
            </label>
          </div>

          <div className="md:col-span-12">
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={submit} disabled={loading || (!form.channelId) || (!form.userId && !form.userEmail)} className="px-4 py-2 rounded border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60">{loading ? 'Creating...' : 'Create Subscription'}</button>
            </div>
            {message && <div className="mt-3 text-sm text-white/80">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
