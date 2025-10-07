'use client';

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


  useEffect(() => {
    if (!channelId || !Number.isFinite(channelId)) return
    fetch(`/api/admin/categories/category?id=${channelId}`).then(r=>r.json()).then((d)=>{ if (d.channel) setChannel(d.channel); else if (d.channel === undefined && d.id) setChannel(d) })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])



  const addRow = () => setRows(r => [...r, { code: '', duration: 1, credit: 0 }])
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<Row>) => setRows(r => r.map((row, idx) => idx === i ? { ...row, ...patch } : row))

  const submit = async () => {
    if (!channelId) return
    setLoading(true)
    setMessage(null)
    try {
 
        
        
        const payloads = rows.map(r => ({ channelId, code: r.code.trim(), durationMonths: r.duration, credit: Number(r.credit || 0) })).filter(r => r.code)
        // Authorization header: try localStorage or fallback to mock admin email
        let authToken = ''
        try {
          const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
          const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
          if (storedId) authToken = `Bearer ${storedId}`
          else if (storedEmail) authToken = `Bearer email:${storedEmail}`
          else authToken = `Bearer email:admin@local`
        } catch (e) { authToken = `Bearer email:admin@local` }
        await fetch('/api/admin/categories/category/subscription', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authToken }, body: JSON.stringify(payloads) })
      
      setMessage('Subscription codes added')
      setRows([{ code: '', duration: 1, credit: 0 }])
    } catch (err: any) {
      setMessage(String(err?.message || err))
    } finally { setLoading(false) }
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Add Subscription codes for Channel  {channel?.name ? `- ${channel.name}` : ''}</h1>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid gap-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={row.code} onChange={(e)=>updateRow(i, { code: e.target.value })} placeholder="Code" className="col-span-5 bg-black/30 border border-white/10 rounded px-3 py-2 text-white" />
              <select value={String(row.duration)} onChange={(e)=>updateRow(i, { duration: Number(e.target.value) })} className="col-span-3 bg-black/30 border border-white/10 rounded px-3 py-2 text-white">
                <option value={1}>1 month</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
              <input type="number" value={row.credit} onChange={(e)=>updateRow(i, { credit: Number(e.target.value) })} placeholder="Credit" className="col-span-3 bg-black/30 border border-white/10 rounded px-3 py-2 text-white" />
              <div className="col-span-1">
                <button onClick={()=>removeRow(i)} className="px-3 py-2 rounded border border-red-500/30 text-red-400">Remove</button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={addRow} className="px-4 py-2 rounded border border-white/10 text-white/80">Add row</button>
            <button onClick={submit} disabled={loading} className="px-4 py-2 rounded border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60">{loading ? 'Adding...' : 'Add Codes'}</button>
          </div>

          {message && <div className="text-sm text-white/70">{message}</div>}

  
        </div>
      </div>
    </div>
  )
}
