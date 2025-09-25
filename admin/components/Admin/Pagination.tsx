"use client"

interface PaginationProps {
  total: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Pagination({ total, pageSize, page, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pages: (number | string)[] = []

  const push = (p: number | string) => pages.push(p)

  if (totalPages <= 7) {
    range(1, totalPages).forEach(push)
  } else {
    push(1)
    if (page > 3) push('<')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    range(start, end).forEach(push)
    if (page < totalPages - 2) push('>')
    push(totalPages)
  }

  const go = (token: number | string) => {
    if (typeof token === 'number') return onPageChange(token)
    if (token === '<') return onPageChange(Math.max(1, page - 1))
    if (token === '>') return onPageChange(Math.min(totalPages, page + 1))
  }

  return (
    <div className="flex items-center gap-2">
      {pages.map((p, i) => {
        const isActive = p === page
        return (
          <button
            key={`${p}-${i}`}
            onClick={() => go(p)}
            className={`w-8 h-8 rounded-md border text-sm grid place-items-center transition-colors ${
              isActive ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        )
      })}
      <div className="ml-3 text-xs text-white/50">Page {page} of {totalPages}</div>
    </div>
  )
}
