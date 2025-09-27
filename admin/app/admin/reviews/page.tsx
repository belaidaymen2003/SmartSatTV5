export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Reviews</h1>
        <a href="/admin" className="text-sm text-white/60 hover:text-white">Back to Dashboard</a>
      </div>
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <p className="text-white/70">Approve, edit, or remove reviews. Connected to in-browser storage now; can switch to DB.</p>
      </div>
    </div>
  )
}
