type Props = { params: { slug: string } }

const titleFromSlug = (slug: string) => {
  const map: Record<string, string> = {
    'iptv': 'IPTV',
    'gift-cards': 'GIFT CARDS',
    'bein-sports': 'beIN SPORTS',
    'goosat': 'Goosat',
    'carte-internet': 'CARTE INTERNET',
    'streaming': 'Streaming',
  }
  return map[slug] ?? slug.replace(/-/g, ' ')
}

export default function CategoryPage({ params }: Props) {
  const title = titleFromSlug(params.slug)
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-white/70">Category management for {title}.</p>
    </div>
  )
}
