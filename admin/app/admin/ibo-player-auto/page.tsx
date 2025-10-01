"use client"

import { useMemo, useState } from 'react'
import { Check, Copy, Download, Plus, RefreshCw, Trash2 } from 'lucide-react'

export default function IboPlayerAutoPage() {
  const [deviceId, setDeviceId] = useState('')
  const [profileName, setProfileName] = useState('Default')
  const [licenses, setLicenses] = useState<{ id: number; deviceId: string; profile: string; license: string; createdAt: string }[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const create = () => {
    if (!deviceId.trim()) return
    const id = Date.now()
    const license = `IBO-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    setLicenses([{ id, deviceId: deviceId.trim(), profile: profileName.trim(), license, createdAt: new Date().toISOString() }, ...licenses])
    setDeviceId('')
  }

  const csv = useMemo(() => {
    const header = 'deviceId,profile,license,createdAt\n'
    return header + licenses.map(l => `${l.deviceId},${l.profile},${l.license},${l.createdAt}`).join('\n')
  }, [licenses])

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibo-licenses.csv'
    a.click(); URL.revokeObjectURL(url)
  }

  const copy = async (text: string) => { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(()=>setCopied(null), 1200) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">ibo Player Auto</h1>
        <button onClick={download} disabled={!licenses.length} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={deviceId} onChange={(e)=>setDeviceId(e.target.value)} placeholder="Device ID" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <input value={profileName} onChange={(e)=>setProfileName(e.target.value)} placeholder="Profile Name" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <button onClick={create} className="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"><Plus className="w-4 h-4" />Create License</button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="px-4 py-3 text-left">Device</th>
                <th className="px-4 py-3 text-left">Profile</th>
                <th className="px-4 py-3 text-left">License</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(l => (
                <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80">{l.deviceId}</td>
                  <td className="px-4 py-3 text-white/80">{l.profile}</td>
                  <td className="px-4 py-3 text-white font-mono">{l.license}</td>
                  <td className="px-4 py-3 text-white/60">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>copy(l.license)} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Copy">{copied===l.license ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}</button>
                      <button onClick={()=>setLicenses((s)=>s.filter(x=>x.id!==l.id))} className="p-2 rounded-md bg-white/5 hover:bg-white/10" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!licenses.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/60">No licenses created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
