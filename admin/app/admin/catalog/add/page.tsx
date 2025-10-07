"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Film, Image as ImageIcon, Link as LinkIcon, Upload, Video } from 'lucide-react'
import AdminStore from '../../../../lib/adminStore'

export const dynamic = 'force-dynamic'

const qualities = ['SD', 'HD', 'FullHD', '4K'] as const
const categories = ['Movie', 'TV Series', 'Anime', 'Cartoon', 'Live TV', 'Streaming'] as const

export default function AddItemPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [quality, setQuality] = useState<typeof qualities[number]>('FullHD')
  const [age, setAge] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [runtime, setRuntime] = useState('')
  const [premiere, setPremiere] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [country, setCountry] = useState('')
  const [director, setDirector] = useState('')
  const [actors, setActors] = useState('')
  const [category, setCategory] = useState<typeof categories[number]>('Movie')
  const [mediaUrl, setMediaUrl] = useState('')
  const [loading, setLoading] = useState(false)

  /*useEffect(() => {
    const cat = search.get('category') as typeof categories[number] | null
    const gen = search.get('genre')
    if (cat && categories.includes(cat)) setCategory(cat)
    if (gen) setGenre(gen)
  }, [search])*/

  const onFile = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaUrl(url)
  }

  const publish = () => {
    if (!title.trim()) return
    setLoading(true)
    AdminStore.addItem({
      title: title.trim(),
      rating: 0,
      category,
      views: 0,
      status: 'Visible',
      mediaUrl: mediaUrl || undefined,
      quality,
      age: age || undefined,
      description: description || undefined,
      genres: genre ? genre.split(',').map((g) => g.trim()).filter(Boolean) : undefined,
      runtime: runtime || undefined,
      premiereDate: premiere || undefined,
      coverUrl: coverUrl || undefined,
      backgroundUrl: backgroundUrl || undefined,
      country: country || undefined,
      director: director || undefined,
      actors: actors ? actors.split(',').map((a) => a.trim()).filter(Boolean) : undefined,
    })
    router.push('/admin/catalog')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Add Item</h1>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="md:col-span-8 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          <select value={quality} onChange={(e) => setQuality(e.target.value as any)} className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white">
            {qualities.map((q) => (<option key={q}>{q}</option>))}
          </select>
          <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="md:col-span-12 h-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />

          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <ImageIcon className="w-4 h-4 text-white/60" />
              <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="Upload cover (URL)" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
            </label>
            <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <LinkIcon className="w-4 h-4 text-white/60" />
              <input value={backgroundUrl} onChange={(e) => setBackgroundUrl(e.target.value)} placeholder="Link to the background (1920x1080)" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
            </label>
          </div>

          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Choose genre (comma separated)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
            <input value={runtime} onChange={(e) => setRuntime(e.target.value)} placeholder="Running time" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
            <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <input value={premiere} onChange={(e) => setPremiere(e.target.value)} placeholder="Premiere date" className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
            </label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Choose country" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          </div>

          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Choose director" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
            <input value={actors} onChange={(e) => setActors(e.target.value)} placeholder="Choose actors (comma separated)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
          </div>

          <div className="md:col-span-12">
            <div className="text-white/70 text-sm mb-2">Item type:</div>
            <div className="flex items-center gap-6">
              {categories.map((c) => (
                <label key={c} className="inline-flex items-center gap-2 text-white/80">
                  <input type="radio" name="category" value={c} checked={category === c} onChange={() => setCategory(c)} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-12">
            <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <Video className="w-4 h-4 text-white/60" />
              <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder={category === 'Live TV' || category === 'Streaming' ? 'Stream URL (HLS .m3u8, DASH .mpd)' : 'Upload video or paste URL'} className="bg-transparent text-white placeholder-white/30 w-full outline-none" />
              <label className="ml-2 cursor-pointer inline-flex items-center gap-1 text-white/70">
                <Upload className="w-4 h-4" />
                <span>Browse</span>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button disabled={loading || !title.trim()} onClick={publish} className="px-5 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 inline-flex items-center gap-2">
            <Film className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
