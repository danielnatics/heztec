import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Tag, User } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, category, tags, author_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  const categories = ["All", "Embedded Systems", "PCB Design", "IoT", "3D Printing", "Power Systems"];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="h-1 w-full bg-green-600" />

      {/* ── PAGE HEADER ── */}
      <section className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 serif pointer-events-none select-none"
          style={{ fontSize: "clamp(100px,16vw,240px)", color: "rgba(22,163,74,0.04)", lineHeight: 1, letterSpacing: "-0.05em" }}>
          BLOG
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-[2px] bg-green-600" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-slate-400">HezTec Blog</span>
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(40px,6vw,88px)", lineHeight: 1.0, color: "#0f172a", letterSpacing: "-0.02em", maxWidth: 700 }}>
            Engineering<br /><em style={{ color: "#16a34a" }}>Insights.</em>
          </h1>
          <p className="mt-5 text-slate-500 text-base leading-relaxed max-w-md">
            Deep dives into embedded systems, PCB design, IoT, power engineering, and hardware innovation from the HezTec lab.
          </p>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="border-b border-slate-100 bg-slate-50/60 sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((c, i) => (
              <button key={i}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  i === 0
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24">

        {/* ── FEATURED POST ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`}
            className="group block mb-20 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-900/5 hover:border-green-100 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-72 lg:h-auto bg-slate-100 min-h-[280px]">
                {featured.cover_image ? (
                  <Image src={featured.cover_image} alt={featured.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "#0f172a", backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
                    <span className="serif text-8xl" style={{ color: "rgba(22,163,74,0.15)" }}>H</span>
                  </div>
                )}
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#16a34a" }}>
                    Featured
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-10 md:p-14 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                </div>
                <h2 className="serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4 group-hover:text-green-800 transition-colors"
                  style={{ letterSpacing: "-0.02em" }}>
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><User size={12} /> {featured.author_name}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {featured.published_at ? new Date(featured.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 group-hover:gap-3 transition-all">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── POST GRID ── */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:border-green-100 transition-all duration-300 bg-white">
                {/* Cover */}
                <div className="relative h-52 bg-slate-100">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "#f8fafc", backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                      <span className="serif text-5xl" style={{ color: "rgba(22,163,74,0.15)" }}>Hz</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-3">{post.category}</span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-3 group-hover:text-green-800 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={11} />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </div>
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !featured ? (
          <div className="py-32 text-center border border-dashed border-slate-200 rounded-3xl">
            <span className="serif text-6xl" style={{ color: "rgba(22,163,74,0.15)" }}>Hz</span>
            <p className="mt-4 text-slate-400 font-medium">No posts published yet. Check back soon.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}