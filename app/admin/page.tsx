import { Users, Clock, Star, TrendingUp, Eye, Plus } from 'lucide-react'
import StatsCard from '../../components/Admin/StatsCard'
import TableCard from '../../components/Admin/TableCard'

const topItems = [
  { id: 241, title: 'The Lost City', category: 'Movie', rating: 9.2 },
  { id: 825, title: 'Undercurrents', category: 'Movie', rating: 9.1 },
  { id: 9271, title: 'Tales from the Underworld', category: 'TV Series', rating: 9.0 },
  { id: 635, title: 'The Unseen World', category: 'TV Series', rating: 8.9 },
  { id: 825, title: 'Redemption Road', category: 'TV Series', rating: 8.9 },
]

const latestItems = [
  { id: 824, item: 'I Dream in Another Language', category: 'TV Series', rating: 7.2 },
  { id: 602, item: 'Benched', category: 'Movie', rating: 6.3 },
  { id: 538, item: 'Whitney', category: 'TV Show', rating: 8.4 },
  { id: 129, item: 'Blindspotting', category: 'Anime', rating: 9.0 },
  { id: 360, item: 'Another', category: 'Movie', rating: 7.7 },
]

const latestUsers = [
  { id: 23, full_name: 'Brian Cranston', email: 'bcxw2@email.com', username: 'BrianXWZ' },
  { id: 22, full_name: 'Jesse Plemons', email: 'jess@email.com', username: 'Jesse.P' },
  { id: 21, full_name: 'Matt Jones', email: 'matt@email.com', username: 'Matty' },
  { id: 20, full_name: 'Tess Harper', email: 'harper@email.com', username: 'Harper123' },
  { id: 19, full_name: 'Jonathan Banks', email: 'bank@email.com', username: 'Jonathan' },
]

const latestReviews = [
  { id: 824, item: 'I Dream in Another Language', author: 'Eliza Josceline', rating: 7.2 },
  { id: 602, item: 'Benched', author: 'Ketut', rating: 6.3 },
  { id: 538, item: 'Whitney', author: 'Brian Cranston', rating: 8.4 },
  { id: 129, item: 'Blindspotting', author: 'Quang', rating: 9.0 },
  { id: 360, item: 'Another', author: 'Jackson Brown', rating: 7.7 },
]

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <button className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Subscriptions this month" value="1 678" change="+15" icon={<TrendingUp className="w-6 h-6" />} />
        <StatsCard title="Items added this month" value="376" change="-44" icon={<Star className="w-6 h-6" />} />
        <StatsCard title="Views this month" value="509 573" change="+3.1%" icon={<Eye className="w-6 h-6" />} />
        <StatsCard title="Reviews this month" value="642" change="+8" icon={<Star className="w-6 h-6" />} />
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
