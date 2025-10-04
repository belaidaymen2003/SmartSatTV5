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
  cost: number;
  description: string;
  url: string;
};
const formData = new FormData();
export default function CategoryPage() {
  const search = useSearchParams();
  const [localurl, setLocalUrl] = useState("");
  
  const [data, setData] = useState<data>({
    title: "",
    category: "",
    cost: 0,
    description: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const onFileImage = (file?: File) => {
    if (!file) return;
    
    const urlLogo = URL.createObjectURL(file);
    setLocalUrl(urlLogo);
        const reader = new FileReader();
  
  formData.append("file", file);
  formData.append("fileName", file.name);
  };
console.log(formData.get("file"));
  async function submitData() {
    
    setLoading(true);
 const response = await  fetch("/api/admin/categories/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
   await fetch(`/api/admin/categories/category?slug=${search.get("category")}` , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...data, logoUrl: response.logoUrl, fileId: response.fileId}),
    })

      .then((res) => res.json())
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
setLoading(false);

  }
  const videoRef = useRef(null);
/*const channelUrl = 'https://ik.imagekit.io/belaidaymen444/primary_160.m3u8';
  useEffect(() => {
    if (!videoRef.current) return;

    // If browser supports HLS natively
    if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = channelUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(channelUrl);
      hls.attachMedia(videoRef.current);
      return () => {
        hls.destroy();
      }
    }
  }, [channelUrl]);*/

  return (
    <div className="space-y-6">
       {/*<div>
         <video ref={videoRef} controls width="100%" height="auto" />
       </div>
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-semibold text-white">Add Item</h1>
       </div>*/}

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value.trim() })}
            placeholder="Title"
            className="md:col-span-8 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30"
          />
          <select
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value.trim() })}
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            {categories.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          <input
            type="number"
            defaultValue={0}
            min={0}
            value={data.cost}
            onChange={(e) => setData({ ...data, cost: Number(e.target.value) })}
            placeholder="Cost"
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30"
          />

          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value.trim() })}
            placeholder="Description"
            className="md:col-span-12 h-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30"
          />

          <div className="md:col-span-12 flex w-full gap-3">
            <label className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <ImageIcon className="w-4 h-4 text-white/60" />

              <label className="ml-2 cursor-pointer inline-flex items-center gap-1 text-white/70">
                                <img src={localurl} alt="" className=" h-10 w-14 object-contain" />
                <Upload className="w-4 h-4" />
                <span>Browse</span>
                <input
                  //value = {mediaUrl?}
                  onChange={(e) => {
                    onFileImage(e.target.files?.[0]);
                  }}
                  type="file"
                  className="hidden" /*onChange={(e) => onFile(e.target.files?.[0])} */
                />
              </label>
            </label>
            <label className="flex flex-1   items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <Video className="w-8 h-8 text-white/60" />
              <input
                value={data.url} onChange={(e) => setData({ ...data, url: e.target.value.trim() })} placeholder='Stream URL (HLS .m3u8, DASH .mpd)'  className="bg-transparent text-white placeholder-white/30 w-full outline-none"
              />
              

            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={loading || !data.title.trim()} onClick={submitData} className="px-5 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Film className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
