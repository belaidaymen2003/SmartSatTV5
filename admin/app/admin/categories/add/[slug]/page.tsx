import {
  Calendar,
  Film,
  ImageIcon,
  LinkIcon,
  Upload,
  Video,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
const categories = [
  "Movie",
  "TV Series",
  "Anime",
  "Cartoon",
  "Live TV",
  "Streaming",
] as const;
type Props = { params: { category: string } };
type data = {
  title: string;
  category: string;
  description: string;

};
const formData = new FormData();
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const search = useSearchParams();
  const [localurl, setLocalUrl] = useState("");

  const [data, setData] = useState<data>({
    title: "",
    category: "",
    description: "",
  });
  const [gift, setGift] = useState({ title: "", description: "" })
  const [loading, setLoading] = useState(false);

  const onFileImage = (file?: File) => {
    if (!file) return;

    const urlLogo = URL.createObjectURL(file);
    setLocalUrl(urlLogo);


    formData.append("file", file);
    formData.append("fileName", file.name);
  };
  console.log(formData.get("file"));
  async function submitData() {
    setLoading(true);
    try {
      if (params.slug === 'gift-cards') {
        let uploaded: any = null
        if (formData.get('file')) {
          uploaded = await fetch('/api/admin/gift-cards/upload', { method: 'POST', body: formData }).then(r=>r.json())
        }
        await fetch('/api/admin/gift-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: gift.title, description: gift.description, coverUrl: uploaded?.url || null })
        })
      } else {
        const response = await fetch("/api/admin/categories/upload", { method: "POST", body: formData }).then((res) => res.json())
        await fetch(`/api/admin/categories/category?slug=${search.get("category")}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({...data, logoUrl: response.logoUrl, fileId: response.fileId}),
        }).then((res)=>res.json())
      }
    } finally {
      setLoading(false)
    }
  }
  const videoRef = useRef(null);

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        {params.slug === 'gift-cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Title</label>
                <input value={gift.title} onChange={(e)=>setGift({ ...gift, title: e.target.value })} placeholder="Gift title" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Description</label>
                <textarea value={gift.description} onChange={(e)=>setGift({ ...gift, description: e.target.value })} placeholder="Short description" className="w-full h-36 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-black/30 p-4 rounded-lg flex flex-col items-center">
                <div className="w-full text-sm text-white/70 mb-3">Cover</div>
                <div className="h-40 w-full bg-white/5 rounded-md flex items-center justify-center overflow-hidden">
                  {localurl ? <img src={localurl} alt="cover" className="h-full w-full object-contain" /> : <ImageIcon className="w-8 h-8 text-white/40" />}
                </div>
                <div className="mt-4 w-full flex gap-2">
                  <label className="flex-1 text-center px-3 py-2 rounded-lg border border-white/10 cursor-pointer hover:bg-white/6">Browse
                    <input onChange={(e) => { onFileImage(e.target.files?.[0]); }} type="file" className="hidden" />
                  </label>
                  <button className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400" onClick={()=>{ setLocalUrl(''); formData.delete('file') }}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Title</label>
                <input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Category</label>
                  <select
                    value={data.category}
                    onChange={(e) => setData({ ...data, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {categories.map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <div className="text-sm text-white/70 mb-2">Optional</div>
                  <div className="text-sm text-white/50">Additional settings can go here</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Description"
                  className="w-full h-36 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-white/70 mb-3">Cover / Logo</div>
                <div className="h-40 w-full bg-white/5 rounded-md flex items-center justify-center overflow-hidden">
                  {localurl ? <img src={localurl} alt="cover" className="h-full w-full object-contain" /> : <ImageIcon className="w-8 h-8 text-white/40" />}
                </div>

                <div className="mt-4 flex gap-2">
                  <label className="flex-1 text-center px-3 py-2 rounded-lg border border-white/10 cursor-pointer hover:bg-white/6">Browse
                    <input
                      onChange={(e) => { onFileImage(e.target.files?.[0]); }}
                      type="file"
                      className="hidden"
                    />
                  </label>
                  <button type="button" onClick={()=>{ setLocalUrl(''); formData.delete('file') }} className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400">Remove</button>
                </div>

                <div className="mt-6">
                  <button
                    disabled={loading || !data.title.trim()}
                    onClick={submitData}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold shadow"
                  >
                    {loading ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
