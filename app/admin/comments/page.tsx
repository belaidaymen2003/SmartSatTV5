export default function AdminCommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Comments</h1>
        <a href="/admin" className="text-sm text-white/60 hover:text-white">Back to Dashboard</a>
      </div>
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <p className="text-white/70">Moderate comments. Hook into your DB to fetch pending items.</p>
      </div>
    </div>
  )
}
