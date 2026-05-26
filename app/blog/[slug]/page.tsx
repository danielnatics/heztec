import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch the specific post by its slug from the database
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  // If the post doesn't exist or an error occurs, throw a clean Next.js 404
  if (error || !post) {
    notFound();
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Draft";

  return (
    <div className="min-h-screen bg-white pb-20 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Dynamic Font Styling Injection to match your Tiptap Editor output cleanly */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');
        
        .serif-title { font-family: 'DM Serif Display', serif; }
        .prose-content h1 { font-family: 'DM Serif Display', serif; font-size: 2.25rem; color: #0f172a; margin: 2rem 0 1rem; tracking: -0.02em; }
        .prose-content h2 { font-family: 'DM Serif Display', serif; font-size: 1.75rem; color: #0f172a; margin: 2rem 0 0.75rem; tracking: -0.02em; }
        .prose-content h3 { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 1.5rem 0 0.5rem; }
        .prose-content p { color: #334155; line-height: 1.8; margin-bottom: 1.25rem; font-size: 1.05rem; }
        .prose-content a { color: #16a34a; text-decoration: underline; font-weight: 600; }
        .prose-content ul, .prose-content ol { color: #334155; padding-left: 1.75rem; margin-bottom: 1.25rem; line-height: 1.8; }
        .prose-content ul { list-style-type: disc; }
        .prose-content ol { list-style-type: decimal; }
        .prose-content blockquote { border-left: 4px solid #16a34a; padding: 0.75rem 1.25rem; margin: 1.5rem 0; background: #f0fdf4; border-radius: 0 12px 12px 0; }
        .prose-content blockquote p { color: #166534; margin: 0; font-style: italic; }
        .prose-editor pre, .prose-content pre { background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 12px; overflow-x: auto; margin: 1.5rem 0; font-size: 0.9rem; }
        .prose-content code { background: #f1f5f9; color: #16a34a; padding: 0.2em 0.4em; border-radius: 6px; font-size: 0.875em; font-family: monospace; }
        .prose-content pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }
        .prose-content img { border-radius: 16px; margin: 1.5rem 0; max-width: 100%; height: auto; }
        .prose-content strong { color: #0f172a; font-weight: 700; }
      `}</style>

      {/* --- HERO HEADER COVER IMAGE BANNER --- */}
      {post.cover_image && (
        <div className="relative w-full h-[35vh] md:h-[45vh] bg-slate-900">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Back Link Layout */}
        <div className="pt-8 pb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-green-600 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Articles
          </Link>
        </div>

        {/* --- ARTICLE HEADER --- */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-black uppercase tracking-wider">
            {post.category || "Engineering"}
          </span>
          
          <h1 className="serif-title text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Metadata Grid Info */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-300" />
              <span className="text-slate-700">{post.author_name || "HezTec Lab"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-300" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* --- MAIN BLOG RICH CONTENT BODY --- */}
        <article 
          className="prose-content pt-8 pb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* --- TAG CHIPS ARRAY FOOTER --- */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-slate-300 mr-1" />
            {post.tags.map((tag: string, i: number) => (
              <span 
                key={i} 
                className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}