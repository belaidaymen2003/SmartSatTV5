"use client"

import { useEffect, useState } from 'react'
import AdminStore from '../../../lib/adminStore'
import type { AdminSettings } from '../../../lib/adminStore'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(AdminStore.getSettings())
  const [saving, setSaving] = useState(false)

  useEffect(() => {AdminStore.subscribe(() => setSettings(AdminStore.getSettings()))}, [])

  const save = () => { setSaving(true); AdminStore.updateSettings(settings); setTimeout(()=>setSaving(false), 300) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-white/70 text-sm">Brand name</span>
            <input value={settings.brandName} onChange={(e)=>setSettings({...settings, brandName: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-white/70 text-sm">Accent color</span>
            <input type="color" value={settings.accentColor} onChange={(e)=>setSettings({...settings, accentColor: e.target.value})} className="h-10 w-16 bg-transparent" />
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.allowRegistrations} onChange={(e)=>setSettings({...settings, allowRegistrations: e.target.checked})} />
            <span className="text-white/80">Allow new registrations</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e)=>setSettings({...settings, maintenanceMode: e.target.checked})} />
            <span className="text-white/80">Maintenance mode</span>
          </label>
        </div>
        <div className="mt-6">
          <button onClick={save} className="px-5 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
