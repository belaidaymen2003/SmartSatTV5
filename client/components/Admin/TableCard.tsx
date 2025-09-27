'use client'

export default function TableCard({ title, columns, rows }:{ title:string, columns:string[], rows: any[] }) {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <span className="text-orange-400">●</span>
          {title}
        </h4>
        <button className="text-sm text-white/60 hover:text-white transition-colors">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-white/50 border-b border-white/10">
              {columns.map((c) => (
                <th key={c} className="py-3 pr-4 font-medium text-xs uppercase tracking-wider">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                {columns.map((c, i) => {
                  const key = c.toLowerCase().replace(/\s+/g,'_')
                  const value = r[key] ?? '-'
                  const isRating = c.toLowerCase() === 'rating'
                  return (
                    <td key={i} className={`py-3 pr-4 ${
                      isRating ? 'text-yellow-400 font-medium' : 'text-white/80'
                    }`}>
                      {isRating && typeof value === 'number' ? `⭐ ${value}` : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
