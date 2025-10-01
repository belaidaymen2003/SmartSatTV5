"use client"

import { useMemo, useState } from 'react'
import { Check, Clipboard, Copy, Download, Play, Plus, RefreshCw, Trash2 } from 'lucide-react'

export default function BeInSportAutoPage() {
  const [customerId, setCustomerId] = useState('')
  const [duration, setDuration] = useState(12)
  const [jobs, setJobs] = useState<{ id: number; code: string; customerId: string; months: number; createdAt: string }[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const create = () => {
    if (!customerId.trim() || duration <= 0) return
    const id = Date.now()
    const code = `BNSA-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${duration}`
    setJobs([{ id, code, customerId: customerId.trim(), months: duration, createdAt: new Date().toISOString() }, ...jobs])
    setCustomerId('')
  }

  const csv = useMemo(() => {
    const header = 'code,customerId,months,createdAt\n'
    return header + jobs.map(j => `${j.code},${j.customerId},${j.months},${j.createdAt}`).join('\n')
  }, [jobs])

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bein-sport-activations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = async (text: string) => { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(()=>setCopied(null), 1200) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">beIN SPORT Auto</h1>
        <button onClick={download} disabled={!jobs.length} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={customerId} onChange={(e)=>setCustomerId(e.target.value)} placeholder="Customer ID" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <input value={duration} onChange={(e)=>setDuration(Math.max(1, Number(e.target.value)))} type="number" min={1} placeholder="Months" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <button onClick={create} className="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"><Plus className="w-4 h-4" />Generate Activation</button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Months</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-mono">{j.code}</td>
                  <td className="px-4 py-3 text-white/80">{j.customerId}</td>
                  <td className="px-4 py-3 text-white/80">{j.months}</td>
                  <td className="px-4 py-3 text-white/60">{new Date(j.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>copy(j.code)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Copy">{copied===j.code ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}</button>
                      <button onClick={()=>setJobs((s)=>s.filter(x=>x.id!==j.id))} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!jobs.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/60">No activations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
