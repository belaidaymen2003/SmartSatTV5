"use client"

import { useEffect, useMemo, useState } from 'react'
import { Star, TrendingUp, Eye, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import StatsCard from '../components/Admin/StatsCard'
import TableCard from '../components/Admin/TableCard'
import AdminStore from '../lib/adminStore'

const latestReviews = [
  { id: 824, item: 'I Dream in Another Language', author: 'Eliza Josceline', rating: 7.2 },
  { id: 602, item: 'Benched', author: 'Ketut', rating: 6.3 },
  { id: 538, item: 'Whitney', author: 'Brian Cranston', rating: 8.4 },
  { id: 129, item: 'Blindspotting', author: 'Quang', rating: 9.0 },
  { id: 360, item: 'Another', author: 'Jackson Brown', rating: 7.7 },
]

export default function AdminPage() {
  const [version, setVersion] = useState(0)
  useEffect(() => {AdminStore.subscribe(() => setVersion((v) => v + 1))}, [])

  const users = useMemo(() => AdminStore.getUsers(), [version])
  const catalog = useMemo(() => AdminStore.getCatalog(), [version])

  const nowYYYYMM = new Date().toISOString().slice(0, 7)
  const sameMonth = (iso: string) => iso.slice(0, 7) === nowYYYYMM

  const subsThisMonth = users.filter((u) => sameMonth(u.createdAt)).length
  const itemsThisMonth = catalog.filter((c) => sameMonth(c.createdAt)).length
  const views = catalog.reduce((s, c) => s + (c.views || 0), 0)
  const nf = new Intl.NumberFormat('en-US')
  const reviewsCount = users.reduce((s, u) => s + (u.reviews || 0), 0)

  const topItems = [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 5).map((x) => ({ id: x.id, title: x.title, category: x.category, rating: x.rating }))
  const latestItems = [...catalog].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((x) => ({ id: x.id, item: x.title, category: x.category, rating: x.rating }))
  const latestUsers = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((u) => ({ id: u.id, full_name: u.name, email: u.email, username: u.username }))

  const router = useRouter()
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <button onClick={() => router.push('/admin/catalog/add')} className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Subscriptions this month" value={subsThisMonth} change={subsThisMonth ? '+0' : undefined} icon={<TrendingUp className="w-6 h-6" />} />
        <StatsCard title="Items added this month" value={itemsThisMonth} change={itemsThisMonth ? '+0' : undefined} icon={<Star className="w-6 h-6" />} />
        <StatsCard title="Views (all time)" value={nf.format(views)} change={"+0%"} icon={<Eye className="w-6 h-6" />} />
        <StatsCard title="Reviews (all users)" value={reviewsCount} change={"+0"} icon={<Star className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCard title="Top Items" columns={["ID","Title","Category","Rating"]} rows={topItems} />
        <TableCard title="Latest Items" columns={["ID","Item","Category","Rating"]} rows={latestItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCard title="Latest users" columns={["ID","Full Name","Email","Username"]} rows={latestUsers} />
        <TableCard title="Latest reviews" columns={["ID","Item","Author","Rating"]} rows={latestReviews} />
      </div>
    </div>
  )
}
