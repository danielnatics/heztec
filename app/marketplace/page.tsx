export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function MarketplaceLanding() {
  const supabase = await createClient();

  // Fetch only products marked as featured
  const { data: featuredProducts, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true) 
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) console.error("Fetch Error:", error);

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION: Matching image_af52d4.jpg --- */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-emerald-950">
        {/* Engineering Grid Pattern Placeholder */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center space-y-8 px-4">
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
            Browse our latest products
          </h1>
          <Link 
            href="/marketplace/all" 
            className="inline-block border-2 border-white text-white font-black px-12 py-5 hover:bg-white hover:text-emerald-950 transition-all duration-300 uppercase tracking-widest text-sm active:scale-95"
          >
            Shop all
          </Link>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Featured products
          </h2>
          <Link href="/marketplace/all" className="hidden md:flex items-center gap-2 text-xs font-black uppercase text-emerald-700 hover:gap-4 transition-all tracking-widest">
            View full catalog <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {featuredProducts?.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className="group flex flex-col bg-slate-50"
            >
              <div className="relative aspect-square w-full overflow-hidden border border-slate-100 rounded-2xl p-4">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <span className="text-[10px] font-bold">No Image</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-1">
                <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <span className="text-lg font-medium">
                  ₦{Number(product.offer_price || product.price).toLocaleString()} NGN
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}