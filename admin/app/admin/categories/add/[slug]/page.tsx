"use client";
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <input value={gift.title} onChange={(e)=>setGift({ ...gift, title: e.target.value })} placeholder="Title" className="md:col-span-8 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
            <div className="md:col-span-2"></div>
            <div className="md:col-span-2"></div>
            <textarea value={gift.description} onChange={(e)=>setGift({ ...gift, description: e.target.value })} placeholder="Description" className="md:col-span-12 h-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30" />
            <div className="md:col-span-12 flex w-full gap-3">
              <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <ImageIcon className="w-4 h-4 text-white/60" />
                <label className="ml-2 cursor-pointer inline-flex items-center gap-1 text-white/70">
                  <img src={localurl} alt="" className=" h-10 w-14 object-contain" />
                  <Upload className="w-4 h-4" />
                  <span>Browse</span>
                  <input onChange={(e) => { onFileImage(e.target.files?.[0]); }} type="file" className="hidden" />
                </label>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value.trim() })}
              placeholder="Title"
              className="col-span-12 md:col-span-8 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30"
            />
            <select
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value.trim() })}
              className="col-span-12 sm:col-span-2 md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              {categories.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
            <div className="md:col-span-12 flex w-full gap-3">
              <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                
               <label className=" cursor-pointer inline-flex items-center gap-1 text-white/70">
                  { localurl ? <img src={localurl} alt="" className=" h-10 w-14 object-contain" /> :<ImageIcon className="w-4 h-4 text-white/60" />}
                  <Upload className="w-4 h-4" />
                  <span>Browse</span>
                  <input
                    onChange={(e) => {
                      onFileImage(e.target.files?.[0]);
                    }}
                    type="file"
                    className="hidden"
                  />
                </label>
              </label>

            </div>



            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value.trim() })}
              placeholder="Description"
              className="md:col-span-12 h-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30"
            />
          </div>
        )}

        <div className="mt-6">
          <button
            disabled={loading || (params.slug === 'gift-cards' ? !gift.title.trim() : !data.title.trim())} onClick={submitData} className="px-5 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Film className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
