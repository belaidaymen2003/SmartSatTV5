"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Row = { code: string; duration: number; credit: number }

export default function CategorySubscriptionPage() {
  const params = useParams() as any
  const channelId = Number(params.channel)
  const [channel, setChannel] = useState<any | null>(null)
  const [rows, setRows] = useState<Row[]>([{ code: '', duration: 1, credit: 0 }])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [subs, setSubs] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)

  useEffect(() => {
    if (!channelId || !Number.isFinite(channelId)) return
    fetch(`/api/admin/categories/category?id=${channelId}`).then(r=>r.json()).then((d)=>{ if (d.channel) setChannel(d.channel); else if (d.channel === undefined && d.id) setChannel(d) })
    fetchSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  const addRow = () => setRows(r => [...r, { code: '', duration: 1, credit: 0 }])
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<Row>) => setRows(r => r.map((row, idx) => idx === i ? { ...row, ...patch } : row))

  const getAuthHeader = () => {
    try {
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
      if (storedId) return { Authorization: `Bearer ${storedId}` }
      if (storedEmail) return { Authorization: `Bearer email:${storedEmail}` }
    } catch (e) {}
    return { Authorization: `Bearer email:admin@local` }
  }

  const submit = async () => {
    if (!channelId) return
    setLoading(true)
    setMessage(null)
    try {
      const payloads = rows.map(r => ({ channelId, code: r.code.trim(), durationMonths: r.duration, credit: Number(r.credit || 0) })).filter(r => r.code)
      
        await fetch('/api/admin/categories/category/subscription', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(payloads) })
      
      setMessage('Subscription codes added')
      setRows([{ code: '', duration: 1, credit: 0 }])
      fetchSubscriptions()
    } catch (err: any) {
      setMessage(String(err?.message || err))
    } finally { setLoading(false) }
  }

  const fetchSubscriptions = async () => {
    if (!channelId) return
    const res = await fetch(`/api/admin/categories/category/subscription?channelId=${channelId}`, { headers: { ...getAuthHeader() } })
    const data = await res.json()
    setSubs(Array.isArray(data.subscriptions) ? data.subscriptions : [])
  }

  const removeSub = async (idOrCode: number | string) => {
    const q = typeof idOrCode === 'number' ? `id=${idOrCode}` : `code=${encodeURIComponent(String(idOrCode))}`
    await fetch(`/api/admin/categories/category/subscription?${q}`, { method: 'DELETE', headers: { ...getAuthHeader() } })
    fetchSubscriptions()
  }

  const editRow = (s:any) => {
    setEditing({ id: s.id ?? null, code: s.code, duration: s.duration, credit: s.credit })
  }

  const saveEditRow = async () => {
    if (!editing) return
    const payload: any = { id: editing.id }
    if (typeof editing.code === 'string') payload.code = editing.code
    if (typeof editing.duration !== 'undefined') payload.durationMonths = Number(editing.duration)
    if (typeof editing.credit !== 'undefined') payload.credit = Number(editing.credit)
    const res = await fetch('/api/admin/categories/category/subscription', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(payload) })
    if (res.ok) {
      setEditing(null)
      fetchSubscriptions()
    } else {
      const d = await res.json()
      alert(d?.error || 'Failed to update')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Add Subscription codes for Channel {channel?.name ? `- ${channel.name}` : ''}</h1>
      </div>

      <div className="bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm rounded-xl border border-white/8 p-6">
        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center bg-black/40 p-3 rounded-lg border border-white/8">
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-xs text-white/70 mb-1">Code</label>
                <input value={row.code} onChange={(e)=>updateRow(i, { code: e.target.value })} placeholder="e.g. ABCD1234" className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs text-white/70 mb-1">Duration</label>
                <select value={String(row.duration)} onChange={(e)=>updateRow(i, { duration: Number(e.target.value) })} className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value={1}>1 month</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs text-white/70 mb-1">Credit</label>
                <input type="number" value={row.credit} onChange={(e)=>updateRow(i, { credit: Number(e.target.value) })} placeholder="0" className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div className="col-span-12 sm:col-span-1 flex justify-end">
                <button onClick={()=>removeRow(i)} className="px-3 py-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10">Remove</button>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button onClick={addRow} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 text-white/90 hover:bg-white/4">Add row</button>
            <button onClick={submit} disabled={loading} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold hover:opacity-95 disabled:opacity-50">{loading ? 'Adding...' : 'Add Codes'}</button>
          </div>

          {message && <div className="text-sm text-white/70">{message}</div>}

          <div>
            {editing && (
              <div className="bg-black/20 border border-white/10 rounded p-3 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-white/70 mb-1">Code</label>
                    <input value={editing.code} onChange={(e)=>setEditing({...editing, code: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-white/70 mb-1">Duration</label>
                    <select value={String(editing.duration)} onChange={(e)=>setEditing({...editing, duration: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value={1}>1 month</option>
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-white/70 mb-1">Credit</label>
                    <input type="number" value={editing.credit} onChange={(e)=>setEditing({...editing, credit: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div className="sm:col-span-2 flex gap-2 justify-end">
                    <button onClick={saveEditRow} className="px-3 py-2 rounded bg-green-600/20 border border-green-600 text-green-300">Save</button>
                    <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded border border-white/10">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
