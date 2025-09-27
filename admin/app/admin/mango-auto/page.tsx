"use client"

import { useMemo, useState } from 'react'
import { Check, Copy, Download, Plus, Trash2 } from 'lucide-react'

export default function MangoAutoPage() {
  const [email, setEmail] = useState('')
  const [count, setCount] = useState(1)
  const [tokens, setTokens] = useState<{ id: number; email: string; token: string; createdAt: string }[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const create = () => {
    if (!email.trim() || count <= 0) return
    const batch = Array.from({ length: count }).map(() => ({
      id: Date.now() + Math.floor(Math.random()*1000),
      email: email.trim(),
      token: `MNG-${Math.random().toString(36).slice(2,10).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }))
    setTokens((s)=>[...batch, ...s])
    setEmail('')
    setCount(1)
  }

  const csv = useMemo(()=>{
    const header = 'email,token,createdAt\n'
    return header + tokens.map(t=>`${t.email},${t.token},${t.createdAt}`).join('\n')
  }, [tokens])

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mango-tokens.csv'
    a.click(); URL.revokeObjectURL(url)
  }

  const copy = async (text: string) => { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(()=>setCopied(null), 1200) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Mango Auto</h1>
        <button onClick={download} disabled={!tokens.length} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Customer Email" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <input value={count} onChange={(e)=>setCount(Math.max(1, Number(e.target.value)))} type="number" min={1} placeholder="How many" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <button onClick={create} className="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"><Plus className="w-4 h-4" />Generate Tokens</button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80">{t.email}</td>
                  <td className="px-4 py-3 text-white font-mono">{t.token}</td>
                  <td className="px-4 py-3 text-white/60">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>copy(t.token)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Copy">{copied===t.token ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}</button>
                      <button onClick={()=>setTokens((s)=>s.filter(x=>x.id!==t.id))} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!tokens.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/60">No tokens yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
