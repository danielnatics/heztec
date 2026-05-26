import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  // Fetch related posts (same category, exclude current)
  const { data: related } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image, category, published_at")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', serif; }

        /* Rich text content styles */
        .prose h1 { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: #0f172a; margin: 2rem 0 1rem; letter-spacing: -0.02em; line-height: 1.1; }
        .prose h2 { font-family: 'DM Serif Display', serif; font-size: 1.75rem; color: #0f172a; margin: 2rem 0 0.75rem; letter-spacing: -0.02em; }
        .prose h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 1.5rem 0 0.5rem; }
        .prose p  { color: #475569; line-height: 1.8; margin-bottom: 1.25rem; font-size: 1.0625rem; }
        .prose a  { color: #16a34a; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .prose ul, .prose ol { color: #475569; padding-left: 1.5rem; margin-bottom: 1.25rem; line-height: 1.8; }
        .prose li { margin-bottom: 0.4rem; }
        .prose blockquote { border-left: 3px solid #16a34a; padding: 0.75rem 1.25rem; margin: 1.5rem 0; background: #f0fdf4; border-radius: 0 12px 12px 0; }
        .prose blockquote p { color: #166534; margin: 0; font-style: italic; }
        .prose pre { background: #0f172a; color: #e2e8f0; padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 1.5rem 0; font-size: 0.875rem; line-height: 1.7; }
        .prose code { background: #f1f5f9; color: #16a34a; padding: 0.2em 0.5em; border-radius: 5px; font-size: 0.875em; font-family: 'Fira Code', monospace; }
        .prose pre code { background: transparent; color: inherit; padding: 0; }
        .prose img { border-radius: 16px; margin: 1.5rem 0; width: 100%; }
        .prose strong { color: #0f172a; font-weight: 700; }
        .prose hr { border: none; border-top: 1px solid #e2e8f0; margin: 2.5rem 0; }
      `}</style>

      <div className="h-1 w-full bg-green-600" />

      {/* ── COVER IMAGE ── */}
      {post.cover_image && (
        <div className="relative h-[50vh] min-h-[320px] w-full bg-slate-100">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
        </div>
      )}

      {/* ── ARTICLE ── */}
      <article className="max-w-3xl mx-auto px-6 py-14 md:py-20">

        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-green-700 transition-colors mb-10 group">
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            {post.category}
          </span>
          {post.tags?.map((tag: string) => (
            <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="serif mb-6" style={{ fontSize: "clamp(32px,5vw,56px)", color: "#0f172a", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-10 pb-10 border-b border-slate-100">
          <span className="flex items-center gap-2"><User size={14} /> {post.author_name}</span>
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            {post.published_at ? new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : ""}
          </span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium border-l-4 border-green-500 pl-5 italic">
            {post.excerpt}
          </p>
        )}

        {/* Body */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </article>

      {/* ── RELATED POSTS ── */}
      {related && related.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/60 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-2 flex items-center gap-2">
              <span className="w-5 h-[2px] bg-green-600 inline-block" /> Related Posts
            </p>
            <h3 className="serif text-2xl text-slate-900 mb-10" style={{ letterSpacing: "-0.02em" }}>More on {post.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-green-100 transition-all bg-white">
                  <div className="relative h-44 bg-slate-100">
                    {r.cover_image ? (
                      <Image src={r.cover_image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                        <span className="serif text-4xl" style={{ color: "rgba(22,163,74,0.15)" }}>Hz</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{r.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug group-hover:text-green-800 transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}