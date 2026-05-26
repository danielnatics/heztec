"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Image as ImageIcon, Link as LinkIcon,
  Save, Send, ArrowLeft, X, Upload, Loader2
} from "lucide-react";
import { toast } from "sonner";

const lowlight = createLowlight(common);

const CATEGORIES = ["Embedded Systems", "PCB Design", "IoT", "3D Printing", "Power Systems", "General"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogEditor() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Embedded Systems");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("HezTec Team");
  const [authorEmail, setAuthorEmail] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: "Start writing your post here..." }),
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor outline-none min-h-[400px] px-1",
      },
    },
  });

  // Load existing post if editing
  useEffect(() => {
    if (!isEdit || !params?.id) return;
    const load = async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single();
      if (error) {
        toast.error("Failed to load existing post data.");
        return;
      }
      if (!data) return;
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || "");
      setCategory(data.category || "Embedded Systems");
      setTags(data.tags?.join(", ") || "");
      setAuthorName(data.author_name || "HezTec Team");
      setAuthorEmail(data.author_email || "");
      setCoverImage(data.cover_image || "");
      setStatus(data.status);
      setSlugEdited(true);
      editor?.commands.setContent(data.content || "");
    };
    load();
  }, [isEdit, params?.id, editor, supabase]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title));
  }, [title, slugEdited]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `cover_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file, { upsert: true });
      
      if (error) throw error;
      
      if (data) {
        const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(data.path);
        setCoverImage(urlData.publicUrl);
        toast.success("Cover asset uploaded successfully!");
      }
    } catch (err: any) {
      toast.error("Asset Upload Failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim() || !editor) {
      toast.warning("Please provide an article title before attempting to save.");
      return;
    }
    
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      content: editor.getHTML(),
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      author_name: authorName,
      author_email: authorEmail,
      cover_image: coverImage,
      status: saveStatus,
      published_at: saveStatus === "published" ? new Date().toISOString() : null,
    };

    try {
      if (isEdit && params?.id) {
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", params.id);
          
        if (updateError) throw updateError;
        toast.success("Blog article updated successfully!");
      } else {
        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert([payload]); // Insert execution handles rows inside wrapper arrays
          
        if (insertError) throw insertError;
        toast.success("New blog article published to database ecosystem!");
      }

      setSaved(true);
      setStatus(saveStatus);
      setTimeout(() => setSaved(false), 2000);

      if (saveStatus === "published") {
        router.push("/admin/blog");
        router.refresh();
      }
    } catch (err: any) {
      console.error("HezTec Blog Save Error:", err);
      toast.error(`Database Write Aborted: ${err.message || "Forbidden operation"}`);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt("Image URL:");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt("URL:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarBtn = ({ onClick, active, title, children }: any) => (
    <button type="button" onClick={onClick} title={title}
      className={`p-2 rounded-lg transition-all cursor-pointer ${active ? "bg-green-100 text-green-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');
        .serif { font-family: 'DM Serif Display', serif; }

        .prose-editor h1 { font-family:'DM Serif Display',serif; font-size:2rem; color:#0f172a; margin:1.5rem 0 0.75rem; letter-spacing:-0.02em; line-height:1.1; }
        .prose-editor h2 { font-family:'DM Serif Display',serif; font-size:1.5rem; color:#0f172a; margin:1.5rem 0 0.5rem; letter-spacing:-0.02em; }
        .prose-editor h3 { font-size:1.1rem; font-weight:700; color:#0f172a; margin:1.25rem 0 0.4rem; }
        .prose-editor p  { color:#475569; line-height:1.8; margin-bottom:1rem; }
        .prose-editor a  { color:#16a34a; text-decoration:underline; }
        .prose-editor ul, .prose-editor ol { color:#475569; padding-left:1.5rem; margin-bottom:1rem; line-height:1.8; }
        .prose-editor blockquote { border-left:3px solid #16a34a; padding:0.5rem 1rem; margin:1.25rem 0; background:#f0fdf4; border-radius:0 8px 8px 0; }
        .prose-editor blockquote p { color:#166534; margin:0; font-style:italic; }
        .prose-editor pre { background:#0f172a; color:#e2e8f0; padding:1.25rem; border-radius:10px; overflow-x:auto; margin:1.25rem 0; font-size:0.875rem; }
        .prose-editor code { background:#f1f5f9; color:#16a34a; padding:0.15em 0.4em; border-radius:4px; font-size:0.875em; }
        .prose-editor pre code { background:transparent; color:inherit; padding:0; }
        .prose-editor img { border-radius:12px; margin:1rem 0; max-width:100%; }
        .prose-editor strong { color:#0f172a; font-weight:700; }
        .prose-editor .is-editor-empty:first-child::before { content:attr(data-placeholder); color:#94a3b8; pointer-events:none; float:left; height:0; }
        .ProseMirror-focused { outline: none; }
      `}</style>

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-6 lg:px-10 py-4 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/blog")}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-600">
              {isEdit ? "Edit Post" : "New Post"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === "published" ? "bg-green-500" : "bg-amber-400"}`} />
              {status === "published" ? "Published" : "Draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full animate-pulse">
              Saved ✓
            </span>
          )}
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
          </button>
          <button onClick={() => handleSave("published")} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 cursor-pointer"
            style={{ background: "#16a34a" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} {isEdit && status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── EDITOR (left, 2 cols) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <input
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full serif text-3xl text-slate-900 outline-none placeholder:text-slate-200 bg-transparent"
              style={{ letterSpacing: "-0.02em" }}
            />
          </div>

          {/* Toolbar + Editor */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-3 border-b border-slate-100 bg-slate-50/60">
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold"><Bold size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic"><Italic size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive("strike")} title="Strikethrough"><Strikethrough size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive("code")} title="Inline Code"><Code size={15} /></ToolbarBtn>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolbarBtn>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List"><List size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Ordered List"><ListOrdered size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote"><Quote size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} title="Code Block"><Code size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={15} /></ToolbarBtn>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <ToolbarBtn onClick={addImage} title="Insert Image"><ImageIcon size={15} /></ToolbarBtn>
              <ToolbarBtn onClick={addLink} active={editor?.isActive("link")} title="Insert Link"><LinkIcon size={15} /></ToolbarBtn>
            </div>

            {/* Editor content area */}
            <div className="p-6 md:p-8">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* ── SIDEBAR (right, 1 col) ── */}
        <div className="space-y-5">
          {/* Cover Image */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Cover Image</p>
            {coverImage ? (
              <div className="relative">
                <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-xl" />
                <button type="button" onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                <Upload size={20} className="text-slate-300 mb-2" />
                <span className="text-xs font-semibold text-slate-400">{uploading ? "Uploading..." : "Upload cover"}</span>
              </label>
            )}
            <div className="mt-3">
              <input type="text" placeholder="Or paste image URL..."
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Post details */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Post Details</p>

            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">URL Slug</label>
              <input type="text" value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true); }}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700 font-mono"
                placeholder="post-url-slug"
              />
              <p className="text-[10px] text-slate-300 mt-1">/blog/{slug || "post-url-slug"}</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700 bg-transparent">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Tags <span className="text-slate-300">(comma separated)</span></label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                placeholder="esp32, firmware, pcb"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Excerpt <span className="text-slate-300">(short summary)</span></label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
                rows={3} placeholder="Brief description of this post..."
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700 placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Author</p>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Name</label>
              <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700"
                placeholder="HezTec Team"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email <span className="text-slate-300">(optional)</span></label>
              <input type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 text-slate-700"
                placeholder="author@heztec.com"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}