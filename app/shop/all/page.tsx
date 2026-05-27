export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import ShopControls from "@/components/shop/ShopControls"; // Pulls in our new interactive header

interface ShopParams {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function AllProducts({ searchParams }: ShopParams) {
  const params = await searchParams;
  const supabase = await createClient();

  const activeSearch = params.search || "";
  const activeCategory = params.category || "all";
  const activeSort = params.sort || "random";

  // Build reactive Supabase query builder references
  let query = supabase.from("products").select("*", { count: "exact" });

  // 1. TEXT SEARCH INJECTION
  if (activeSearch.trim()) {
    query = query.ilike("name", `%${activeSearch}%`);
  }

  // 2. CATEGORY FILTERING (Replaces the old stock_quantity filters)
  if (activeCategory !== "all") {
    query = query.eq("category", activeCategory);
  }

  // 3. SORTING MECHANISM
  let shouldShuffleInServer = false;
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
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "random":
    default:
      shouldShuffleInServer = true;
      break;
  }

  const { data: rawProducts, count, error } = await query;
  if (error) console.error("HezTec DB Error:", error);

  // Fetch distinct categories dynamically directly from the existing inventory
  const { data: catData } = await supabase.from("products").select("category");
  const uniqueCategories = Array.from(new Set(catData?.map((c) => c.category).filter(Boolean))) as string[];

  // Execute Math.random shuffle securely on the server side to bypass hydration errors
  const products = rawProducts
    ? shouldShuffleInServer
      ? [...rawProducts].sort(() => Math.random() - 0.5)
      : rawProducts
    : [];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* INJECT INTERACTIVE HEADER CONTROLS */}
        <ShopControls 
          activeSearch={activeSearch}
          activeCategory={activeCategory}
          activeSort={activeSort}
          categories={uniqueCategories}
          productCount={count || 0}
        />

        {/* INVENTORY PRODUCT CARD LAYOUT GRID */}
        {products && products.length > 0 ? (
          <div className="grid min-[600px]:max-[770px]:grid-cols-3 max-[600px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 py-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-28 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <p className="text-slate-400 font-medium text-sm italic">
              No hardware components match your selected filter parameters.
            </p>
            {(activeSearch || activeCategory !== "all") && (
              <Link
                href="/shop"
                className="text-xs font-bold text-green-600 uppercase tracking-wider block mt-4 hover:underline"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}