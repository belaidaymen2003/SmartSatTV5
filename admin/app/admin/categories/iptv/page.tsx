"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import Spinner from "@/components/UI/Spinner";

// IPTV model
type IPTVChannel = {
  id: number;
  name: string;
  logo: string | null;
  description: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};
type logo = {
  logourl: string;
  logofile: File | null;
};
export default function IPTVPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<IPTVChannel | null>(null);
  const [channelId, setChannelId] = useState<number | null>(null);
  const [sipinner1, setSipinner1] = useState<boolean>(false);
  const [subs, setSubs] = useState<
    { id?: number; code: string; duration: number; credit: number }[]
  >([{ id: undefined, code: "", duration: 1, credit: 0 }]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    description: "",
    category: "Live TV",
  });
  const [preview, setPreview] = useState<IPTVChannel | null>(null);
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [logo, setLogo] = useState<logo>({ logourl: "", logofile: null });

  function SubscriptionTable({ channelId }: { channelId: number | null }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<{
      code?: string;
      duration?: number;
      credit?: number;
    }>({});

    const toMonths = (d: any) =>
      typeof d === "number"
        ? d
        : d === "ONE_MONTH"
        ? 1
        : d === "SIX_MONTHS"
        ? 6
        : d === "ONE_YEAR"
        ? 12
        : 1;

    if (!channelId) return null;
    if (sipinner1) return <Spinner size={6} />;

    if (!subs || subs.length === 0)
      return <div className="text-white/60">No subscriptions</div>;

    const getAuthHeader = () => {
      try {
        const storedId =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        const storedEmail =
          typeof window !== "undefined"
            ? localStorage.getItem("userEmail")
            : null;
        if (storedId) return { Authorization: `Bearer ${storedId}` };
        if (storedEmail)
          return { Authorization: `Bearer email:${storedEmail}` };
      } catch (e) {}
      return { Authorization: `Bearer email:admin@local` };
    };

    const startEdit = (s: any) => {
      setEditingId(s.id ?? null);
      setEditValues({
        code: s.code,
        duration: toMonths(s.duration),
        credit: s.credit,
      });
    };

    const cancelEdit = () => {
      setEditingId(null);
      setEditValues({});
    };

    const saveEdit = async (id: number) => {
      try {
        const payload: any = { id };
        if (typeof editValues.code === "string") payload.code = editValues.code;
        if (typeof editValues.duration !== "undefined")
          payload.durationMonths = Number(editValues.duration);
        if (typeof editValues.credit !== "undefined")
          payload.credit = Number(editValues.credit);
        const res = await fetch("/api/admin/categories/category/subscription", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setEditingId(null);
          fetchSubscriptions(channelId);
        } else {
          const d = await res.json();
          alert(d?.error || "Failed to update");
        }
      } catch (e) {
        console.log(e);
      }
    };

    const removeSubWithAuth = async (idOrCode: number | string) => {
      const q =
        typeof idOrCode === "number"
          ? `id=${idOrCode}`
          : `code=${encodeURIComponent(String(idOrCode))}`;
      await fetch(`/api/admin/categories/category/subscription?${q}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      fetchSubscriptions(channelId);
    };

    return (
      <div className="overflow-auto">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-white/70 text-sm">
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Duration</th>
              <th className="px-3 py-2 text-left">Credits</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s: any) => (
              <tr key={s.id || s.code} className="bg-black/40 hover:bg-black/50 rounded-lg">
                <td className="px-3 py-3 align-middle w-40">
                  {editingId === s.id ? (
                    <input
                      value={editValues.code || ""}
                      onChange={(e) => setEditValues((ev) => ({ ...ev, code: e.target.value }))}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                      aria-label="Edit code"
                    />
                  ) : (
                    <div className="text-white font-medium truncate" title={s.code}>{s.code}</div>
                  )}
                </td>
                <td className="px-3 py-3 align-middle text-white/80 w-36">
                  {editingId === s.id ? (
                    <select
                      value={String(editValues.duration ?? toMonths(s.duration))}
                      onChange={(e) => setEditValues((ev) => ({ ...ev, duration: Number(e.target.value) }))}
                      className="w-full bg-white text-black rounded px-2 py-2"
                      aria-label="Edit duration"
                    >
                      <option value={1}>1 month</option>
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                    </select>
                  ) : (
                    <div className="text-white">{toMonths(s.duration)}m</div>
                  )}
                </td>
                <td className="px-3 py-3 align-middle w-28">
                  {editingId === s.id ? (
                    <input
                      type="number"
                      value={String(editValues.credit ?? s.credit)}
                      onChange={(e) => setEditValues((ev) => ({ ...ev, credit: Number(e.target.value) }))}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                      aria-label="Edit credit"
                    />
                  ) : (
                    <div className="text-white">{s.credit ?? 0}</div>
                  )}
                </td>
                <td className="px-3 py-3 text-white/60 w-28">{s.status || "ACTIVE"}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    {editingId === s.id ? (
                      <>
                        <button onClick={() => saveEdit(s.id)} className="flex items-center gap-2 px-3 py-2 rounded bg-green-600/20 border border-green-600 text-green-300 hover:bg-green-600/30">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="px-3 py-2 rounded border border-white/10 text-white/80 hover:bg-white/5">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(s)} className="px-3 py-2 rounded border border-white/10 text-white/90 hover:bg-white/5">Edit</button>
                        <button onClick={() => removeSubWithAuth(s.id ?? s.code)} className="px-3 py-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function PreviewModal({
    channelId,
    channel,
    onClose,
  }: {
    channel: IPTVChannel;
    onClose: () => void;
    channelId: number | null;
  }) {
    return (
      <div
        className="fixed inset-0  z-50 grid place-items-center bg-black/70 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {channel.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="h-8 w-8 rounded bg-white/10 object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded bg-white/10 grid place-items-center">
                  <ImageIcon className="w-4 h-4 text-white/40" />
                </div>
              )}
              <div>
                <div className="text-white font-semibold">{channel.name}</div>
                <div className="text-white/60 text-xs">
                  {channel.category || "Live TV"}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <SubscriptionTable channelId={channelId} />
          <a
            href={`/admin/categories/add/iptv/subscription/${channel.id}`}
            rel="noreferrer"
          >
            <button className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/10 hover:bg-white/10 text-white/80">
              <Edit2 className="w-4 h-4" /> Add Subscription
            </button>
          </a>
        </div>
      </div>
    );
  }
  const fetchSubscriptions = async (channelId: number | null) => {
    if (!channelId) return;
    setSipinner1(true);
    let headers: any = {};
    try {
      const storedId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      const storedEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      if (storedId) headers.Authorization = `Bearer ${storedId}`;
      else if (storedEmail)
        headers.Authorization = `Bearer email:${storedEmail}`;
      else headers.Authorization = `Bearer email:admin@local`;
    } catch (e) {
      headers.Authorization = `Bearer email:admin@local`;
    }

    const res = await fetch(
      `/api/admin/categories/category/subscription?channelId=${channelId}`,
      { headers }
    );
    const data = await res.json();
    if (!data) {
      setSipinner1(false);
      return;
    }
    setSubs(data.subscriptions);
    setSipinner1(false);
  };
  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/category?slug=iptv`, {
        cache: "no-store",
      });
      let data: any = {};
      try {
        data = await res.clone().json();
      } catch {}
      setChannels(Array.isArray(data.channels) ? data.channels : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(channelId);
  }, [channelId]);
  useEffect(() => {
    fetchChannels();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return channels.filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [channels, query]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const openEdit = (ch: IPTVChannel) => {
    console.log(ch);
    console.log(form);
    setEdit(ch);
    setForm({
      name: ch.name || "",
      logo: ch.logo || "",
      description: ch.description || "",
      category: ch.category || "Live TV",
    });
  };

  const saveEdit = async () => {
    if (!edit) return;
   const newlogourl = await replaceLogo()
    const payload = { id: edit.id, ...form, logo: newlogourl.logoUrl };
    await fetch("/api/admin/categories/category", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEdit(null);
    fetchChannels();
  };

  const removeChannel = async (id: number) => {
    if (!confirm("Delete this channel?")) return;
    await fetch(`/api/admin/categories/category?id=${id}`, {
      method: "DELETE",
    });
    fetchChannels();
  };

  const replaceLogo = async () => {
    if (!edit) return;
    const fd = new FormData();
    fd.append("channelId", String(edit.id));
    if(logo.logofile)  {
      fd.append("file", logo.logofile);
    }
    
    fd.append("fileName", logo.logofile?.name || "");
    if (edit.logo) fd.append("oldLogoUrl", edit.logo);
    const res = await fetch("/api/admin/categories/upload", { method: "PUT", body: fd });
    return res.json();
  };

  const deleteLogo = async () => {
    if (!edit) return;
    await fetch("/api/admin/categories/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channelId: edit.id,
        logoUrl: edit.logo || undefined,
      }),
    });
    setForm((f) => ({ ...f, logo: "" }));
    fetchChannels();
  };
useEffect(() => {
  if (!edit) {
    setLogo({ logourl: '', logofile: null });
  }
}, [edit]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          IPTV{" "}
          <span className="text-white/50 text-sm ml-2" suppressHydrationWarning>
            {total} Total
          </span>
        </h1>
        <button
          onClick={() => router.push("/admin/categories/add/iptv")}
          className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD ITEM
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-80">
          <Search className="w-4 h-4 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in IPTV...`}
            className="bg-transparent text-white/80 text-sm w-full placeholder-white/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="text-white/60">No channels</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((ch) => (
              <div
                key={ch.id}
                className="bg-black/30 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => {
                  setPreview(ch);
                  setChannelId(ch.id);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {ch.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {ch.name}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {ch.category || "Live TV"}
                    </div>
                    {ch.description && (
                      <div className="text-xs text-white/50 mt-1 line-clamp-2">
                        {ch.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEdit(ch)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/10 hover:bg-white/10 text-white/80"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => removeChannel(ch.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between p-1">
          <div className="text-white/60 text-xs">
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={start + pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded border border-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <PreviewModal
          channelId={channelId}
          channel={preview}
          onClose={() => setPreview(null)}
        />
      )}

      {edit && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setEdit(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Edit Channel Modal"
        >
          <div
            className="w-full max-w-2xl bg-gradient-to-b from-black/60 to-black/30 border border-white/6 rounded-xl p-6 backdrop-blur-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Edit Channel</h3>
              <button
                onClick={() => setEdit(null)}
                className="p-2 rounded hover:bg-white/6"
                aria-label="Close edit dialog"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4" onSubmit={(e)=>{ e.preventDefault(); saveEdit(); }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-1 flex flex-col items-center">
                  <div className="text-sm text-white/70 mb-2">Logo</div>
                  <div className="flex flex-col items-center gap-3 bg-black/30 p-3 rounded-lg w-full">
                    {form.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo.logourl !== "" ? logo.logourl : form.logo} alt={form.name} className="h-24 w-24 rounded-md bg-white/6 object-contain" />
                    ) : (
                      <div className="h-24 w-24 rounded-md bg-white/6 grid place-items-center">
                        <ImageIcon className="w-6 h-6 text-white/40" />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <label className="px-3 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/6 text-white/90">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setLogo({ logofile: f, logourl: URL.createObjectURL(f) });
                          }}
                        />
                      </label>
                      {form.logo && (
                        <button type="button" onClick={deleteLogo} className="px-3 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10">Remove</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        id="channel-name"
                        className="peer mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Channel name"
                        aria-label="Channel name"
                      />
                      <label htmlFor="channel-name" className="absolute left-4 -top-2.5 bg-black/60 px-1 text-xs text-white/70 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/50 transition-all">
                        Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        id="channel-category"
                        className="peer mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Category"
                        aria-label="Channel category"
                      />
                      <label htmlFor="channel-category" className="absolute left-4 -top-2.5 bg-black/60 px-1 text-xs text-white/70">Category</label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="channel-desc" className="block text-xs text-white/70 mb-1">Description</label>
                    <textarea
                      id="channel-desc"
                      className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description"
                      rows={4}
                      aria-label="Channel description"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setEdit(null)} className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/6">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold shadow">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
