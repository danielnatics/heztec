export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Package } from "lucide-react";

export default async function MarketplaceLanding() {
  const supabase = await createClient();

  const { data: featuredProducts, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) console.error("Fetch Error:", error);

  const categories = [
    { name: "Microcontrollers", icon: "🔲" },
    { name: "Sensors & Modules", icon: "📡" },
    { name: "Power Components", icon: "⚡" },
    { name: "Displays", icon: "🖥️" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .product-card:hover .product-img { transform: scale(1.05); }
        .product-img { transition: transform 0.35s ease; }
      `}</style>

      {/* ── GREEN TOP BAR ── */}
      {/* <div className="h-1 w-full bg-green-600" /> */}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">

        {/* Faint dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />



        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 md:py-10">
          {/* Eyebrow */}
          {/* <div className="flex items-center gap-3 mb-8">
            <div className="w-7 h-[2px] bg-green-600" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-slate-400">
              Electronic Components
            </span>
          </div> */}

          {/* Headline */}
          <h1 className="fade-up d2 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-2xl">
            Browse Our <span className="text-green-600">Products.</span>
          </h1>

          <p className="mt-6 text-base text-slate-500 leading-relaxed max-w-md">
            Microcontrollers, sensors, modules, and power components — sourced and ready to ship.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/shop/all"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 font-bold text-sm text-white rounded-xl transition-all"
              style={{ background: "#16a34a" }}
            >
              Shop All Products
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold text-sm text-slate-700 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-all"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ───────────────────────────────────── */}
      {/* <section className="py-10 border-b border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mr-2">Browse</span>
            {categories.map((c, i) => (
              <Link
                key={i}
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all"
              >
                <span>{c.icon}</span> {c.name}
              </Link>
            ))}
            <Link
              href="/shop/all"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-all ml-auto"
            >
              All Categories <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section> */}

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-10 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section header */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-green-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-green-600 inline-block" /> Featured Products
              </p>
              {/* <h2
                className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
              >
                Hand-Picked Components.
              </h2> */}
            </div>
            <Link
              href="/shop/all"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-green-700 transition-colors group"
            >
              View full catalog
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product grid */}
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid min-[600px]:max-[770px]:grid-cols-3 max-[600px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 py-10">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="product-card group flex flex-col rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-900/5 hover:border-green-100 transition-all duration-300 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-4">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="product-img object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package size={32} className="text-slate-200" />
                      </div>
                    )}
                    {/* Featured badge */}
                    {/* <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ background: "#16a34a" }}
                    >
                      Featured
                    </div> */}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {/* {product.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                        {product.category}
                      </span>
                    )} */}
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="text-base font-black text-slate-900">
                        ₦{Number(product.offer_price || product.price).toLocaleString()}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ background: "#f0fdf4", color: "#16a34a" }}
                      >
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="py-24 text-center border border-dashed border-slate-200 rounded-3xl">
              <Package size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium text-sm">No featured products yet.</p>
              <Link href="/shop/all" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:underline">
                Browse all products <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Mobile view all */}
          <div className="mt-10 md:hidden text-center">
            <Link
              href="/shop/all"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm text-white rounded-xl"
              style={{ background: "#16a34a" }}
            >
              View Full Catalog <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      {/* <section className="py-12 border-t border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✅", title: "Quality Assured", sub: "Components from trusted suppliers" },
              { icon: "🚀", title: "Fast Dispatch", sub: "Same-day processing" },
              { icon: "🛠️", title: "Engineer Support", sub: "Technical help included" },
              { icon: "📦", title: "Bulk Orders", sub: "Discounts available" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}