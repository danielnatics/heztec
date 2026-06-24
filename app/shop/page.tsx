export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import SearchBar from "@/components/shop/SearchBar"; // Imported the new reusable component
import { ArrowRight, Package } from "lucide-react";

export default async function MarketplaceLanding() {
  const supabase = await createClient();

  // 1. Fetch all featured items from the database
  const { data: allFeatured, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true);

  if (error) console.error("Fetch Error:", error);

  // 2. Shuffle the items randomly in memory and slice the top 5 (or 4 depending on your layout grid)
  // We use .sort(() => Math.random() - 0.5) to scramble the array on every request refresh
  const featuredProducts = allFeatured
    ? [...allFeatured].sort(() => Math.random() - 0.5).slice(0, 20)
    : [];

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

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Faint dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22,163,74,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8 md:py-14">
          {/* Headline */}
          <h1 className="fade-up d2 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-2xl">
            Browse Our <span className="text-green-600">Products.</span>
          </h1>

          <p className="text-base text-slate-500 leading-relaxed max-w-md mt-3 mb-8">
            Microcontrollers, sensors, modules, and power components — sourced
            and ready to ship.
          </p>

          {/* Reusable Search Bar Injection */}
          <SearchBar />
          
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-10 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-3 lg:px-12">
          {/* Section header */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-green-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-green-600 inline-block" />{" "}
                Featured Products
              </p>
            </div>
            <Link
              href="/shop/all"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-green-700 transition-colors group"
            >
              View full catalog
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Product grid */}
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid min-[600px]:max-[770px]:grid-cols-2 max-[600px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-2 py-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="py-24 text-center border border-dashed border-slate-200 rounded-3xl">
              <Package size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium text-sm">
                No featured products yet.
              </p>
              <Link
                href="/shop/all"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:underline"
              >
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
    </div>
  );
}