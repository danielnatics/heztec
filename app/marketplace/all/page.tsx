export const revalidate = 0; // Fetch fresh data for your inventory
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import FilterBar from "@/components/marketplace/FilterBar";

export default async function AllProducts({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    availability?: string; 
    sort?: string 
  }> 
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Initialize query
  let query = supabase
    .from("products")
    .select("*", { count: 'exact' });

  // 1. AVAILABILITY LOGIC
  if (params.availability === "in_stock") {
    query = query.gt("stock_quantity", 0);
  } else if (params.availability === "out_of_stock") {
    query = query.eq("stock_quantity", 0);
  }

  // 2. DEFAULT & DYNAMIC SORTING
  // Default to 'newest' if no sort is in the URL
  const activeSort = params.sort || "newest";

  switch (activeSort) {
    case "price_low":
      query = query.order("price", { ascending: true });
      break;
    case "price_high":
      query = query.order("price", { ascending: false });
      break;
    case "alpha_asc":
      query = query.order("name", { ascending: true });
      break;
    case "alpha_desc":
      query = query.order("name", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products, count, error } = await query;

  if (error) console.error("HezTec DB Error:", error);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-slate-900 font-bold text-[32px] tracking-tight">
            Products
          </h1>
        </header>

        {/* Dynamic Filter UI */}
        <FilterBar totalProducts={count || 0} />

        {/* Product Grid - Matching image_aed2da.png */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-16 py-10">
          {products?.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className="group flex flex-col"
            >
              {/* Clean Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5] border border-slate-100 rounded-sm">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300 font-bold text-[10px]">
                    NO COMPONENT IMAGE
                  </div>
                )}
              </div>

              {/* Product Metadata */}
              <div className="pt-4 flex flex-col gap-1.5">
                <h3 className="text-slate-800 text-sm md:text-[15px] font-normal leading-tight group-hover:underline decoration-1 underline-offset-4">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <span className="text-base md:text-[17px]">
                    ₦{Number(product.offer_price || product.price).toLocaleString()}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">NGN</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!products || products.length === 0) && (
          <div className="py-32 text-center">
            <p className="text-slate-400 font-medium text-sm italic">
              Our engineering lab currently has no inventory matching these parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}