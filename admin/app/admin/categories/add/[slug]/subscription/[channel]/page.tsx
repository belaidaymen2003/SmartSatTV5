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
      for (const payload of payloads) {
        await fetch('/api/admin/categories/category/subscription', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(payload) })
      }
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

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid gap-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={row.code} onChange={(e)=>updateRow(i, { code: e.target.value })} placeholder="Code" className="col-span-12 sm:col-span-5 bg-black/30 border border-white/10 rounded px-3 py-2 text-white" />
              <select value={String(row.duration)} onChange={(e)=>updateRow(i, { duration: Number(e.target.value) })} className="col-span-6 sm:col-span-3 bg-black/30 border border-white/10 rounded px-3 py-2 text-white">
                <option value={1}>1 month</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
              <input type="number" value={row.credit} onChange={(e)=>updateRow(i, { credit: Number(e.target.value) })} placeholder="Credit" className="col-span-6 sm:col-span-3 bg-black/30 border border-white/10 rounded px-3 py-2 text-white" />
              <div className="col-span-12 sm:col-span-1">
                <button onClick={()=>removeRow(i)} className="px-3 py-2 rounded border border-red-500/30 text-red-400">Remove</button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={addRow} className="px-4 py-2 rounded border border-white/10 text-white/80">Add row</button>
            <button onClick={submit} disabled={loading} className="px-4 py-2 rounded border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60">{loading ? 'Adding...' : 'Add Codes'}</button>
          </div>

          {message && <div className="text-sm text-white/70">{message}</div>}

          <div>
            <h3 className="text-white font-semibold mb-2">Existing codes</h3>
            {subs.length === 0 ? <div className="text-white/60">No subscriptions</div> : (
              <div className="overflow-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="text-white/70 text-sm"><th className="px-3 py-2">Code</th><th className="px-3 py-2">Duration</th><th className="px-3 py-2">Credits</th><th className="px-3 py-2">Actions</th></tr>
                  </thead>
                  <tbody>
                    {subs.map(s => (
                      <tr key={s.id || s.code} className="bg-black/30 border border-white/10 rounded">
                        <td className="px-3 py-2 align-middle">{s.code}</td>
                        <td className="px-3 py-2 align-middle">{s.duration}m</td>
                        <td className="px-3 py-2 align-middle">{s.credit ?? 0}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button onClick={()=>editRow(s)} className="px-2 py-1 rounded border border-white/10">Edit</button>
                            <button onClick={()=>removeSub(s.id ?? s.code)} className="px-2 py-1 rounded border border-red-500/30 text-red-400">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {editing && (
              <div className="bg-black/20 border border-white/10 rounded p-3 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input value={editing.code} onChange={(e)=>setEditing({...editing, code: e.target.value})} className="sm:col-span-5 bg-black/40 border border-white/10 rounded px-2 py-1 text-white" />
                  <select value={String(editing.duration)} onChange={(e)=>setEditing({...editing, duration: Number(e.target.value)})} className="sm:col-span-3 bg-black/40 border border-white/10 rounded px-2 py-1 text-white">
                    <option value={1}>1 month</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                  </select>
                  <input type="number" value={editing.credit} onChange={(e)=>setEditing({...editing, credit: Number(e.target.value)})} className="sm:col-span-2 bg-black/40 border border-white/10 rounded px-2 py-1 text-white" />
                  <div className="sm:col-span-2 flex gap-2">
                    <button onClick={saveEditRow} className="px-3 py-1 rounded border border-green-500 text-green-400">Save</button>
                    <button onClick={()=>setEditing(null)} className="px-3 py-1 rounded border border-white/10">Cancel</button>
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
