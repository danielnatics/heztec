"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Search, Calendar, ArrowRight } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const supabase = createClient();

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, category, status, author_name, published_at, created_at")
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [filter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await supabase.from("blog_posts").update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    }).eq("id", id);
    fetchPosts();
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display&display=swap');
        .serif { font-family: 'DM Serif Display', serif; }`}
      </style>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 lg:px-10 py-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">HezTec Admin</p>
          <h1 className="serif text-2xl text-slate-900" style={{ letterSpacing: "-0.02em" }}>Blog Posts</h1>
        </div>
        <Link href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
          style={{ background: "#16a34a" }}>
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all capitalize ${
                  filter === f ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 flex-1 max-w-sm ml-auto">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Posts", value: posts.length },
            { label: "Published", value: posts.filter(p => p.status === "published").length },
            { label: "Drafts", value: posts.filter(p => p.status === "draft").length },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="serif text-3xl text-slate-900" style={{ letterSpacing: "-0.02em" }}>{s.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Posts table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">Loading posts...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium text-sm mb-4">No posts found.</p>
              <Link href="/admin/blog/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: "#16a34a" }}>
                Write your first post <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300">Title</th>
                  <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hidden lg:table-cell">Author</th>
                  <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300">Status</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-slate-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{post.author_name}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar size={11} />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                          : new Date(post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        post.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => togglePublish(post.id, post.status)}
                          title={post.status === "published" ? "Unpublish" : "Publish"}
                          className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all">
                          {post.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link href={`/admin/blog/edit/${post.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <Edit size={15} />
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}