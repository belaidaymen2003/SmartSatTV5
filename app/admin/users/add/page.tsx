"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, AtSign, BadgeDollarSign, CheckCircle2, Ban, Hash } from 'lucide-react'
import AdminStore from '../../../../lib/adminStore'

const plans = ['Free', 'Basic', 'Premium', 'Cinematic'] as const
const statuses = ['Approved', 'Banned'] as const

export default function AddUserPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [plan, setPlan] = useState<typeof plans[number]>('Free')
  const [status, setStatus] = useState<typeof statuses[number]>('Approved')
  const [comments, setComments] = useState(0)
  const [reviews, setReviews] = useState(0)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)

  const publish = () => {
    if (!name.trim() || !email.trim() || !username.trim()) return
    setLoading(true)
    AdminStore.addUser({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      plan,
      comments: Math.max(0, comments),
      reviews: Math.max(0, reviews),
      credits: Math.max(0, credits),
      status,
    })
    router.push('/admin/users')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Add User</h1>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="md:col-span-6 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <label className="md:col-span-6 flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <Mail className="w-4 h-4 text-white/60" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
          </label>

          <label className="md:col-span-6 flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <AtSign className="w-4 h-4 text-white/60" />
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
          </label>
          <div className="md:col-span-3">
            <div className="text-white/70 text-sm mb-2">Pricing plan</div>
            <select value={plan} onChange={(e) => setPlan(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
              {plans.map((p) => (<option key={p}>{p}</option>))}
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="text-white/70 text-sm mb-2">Status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
              {statuses.map((s) => (<option key={s}>{s}</option>))}
            </select>
          </div>

          <label className="md:col-span-4 flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <Hash className="w-4 h-4 text-white/60" />
            <input value={comments} onChange={(e) => setComments(Number(e.target.value))} type="number" min={0} placeholder="Comments" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
          </label>
          <label className="md:col-span-4 flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-white/60" />
            <input value={reviews} onChange={(e) => setReviews(Number(e.target.value))} type="number" min={0} placeholder="Reviews" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
          </label>
          <label className="md:col-span-4 flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <BadgeDollarSign className="w-4 h-4 text-white/60" />
            <input value={credits} onChange={(e) => setCredits(Number(e.target.value))} type="number" min={0} placeholder="Credits" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
          </label>
        </div>

        <div className="mt-6">
          <button disabled={loading || !name.trim() || !email.trim() || !username.trim()} onClick={publish} className="px-5 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 inline-flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </div>
    </div>
  )
}
