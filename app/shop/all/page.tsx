export const revalidate = 0; // Force Next.js to bypass caching and run this function on every fresh page refresh
import { createClient } from "@/lib/supabase/server";

import Image from "next/image";
import Link from "next/link";
import FilterBar from "@/components/shop/FilterBar";
import ProductCard from "@/components/shop/ProductCard";

export default async function AllProducts({
  searchParams,
}: {
  searchParams: Promise<{
    availability?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Initialize query database pointer connection
  let query = supabase.from("products").select("*", { count: "exact" });

  // 1. AVAILABILITY FILTERING LOGIC
  if (params.availability === "in_stock") {
    query = query.gt("stock_quantity", 0);
  } else if (params.availability === "out_of_stock") {
    query = query.eq("stock_quantity", 0);
  }

  // 2. CONDITIONAL DATABASE SORT SCHEMES
  // Fallback to 'random' if no explicit sorting selection is present in the URL path
  const activeSort = params.sort || "random"; 
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
    case "alpha_desc":
      query = query.order("name", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "random":
    default:
      // Flag the query execution context to apply the in-memory array shuffle layer below
      shouldShuffleInServer = true;
      break;
  }

  const { data: rawProducts, count, error } = await query;

  if (error) console.error("HezTec DB Error:", error);

  // 3. APPLY IN-MEMORY RANDOM SHUFFLE IF REQUIRED
  // Scrambles the response matrix instantly using Math.random on every request call
  const products = rawProducts
    ? shouldShuffleInServer
      ? [...rawProducts].sort(() => Math.random() - 0.5)
      : rawProducts
    : [];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header>
          <h1 className="text-slate-900 font-bold text-[32px] tracking-tight">
            All Products
          </h1>
        </header>

        {/* Dynamic Filter UI Toolbar wrapper element */}
        {/* <FilterBar totalProducts={count || 0} /> */}

        {/* Product Grid Layout frame */}
        {products && products.length > 0 ? (
          <div className="grid min-[600px]:max-[770px]:grid-cols-3 max-[600px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 py-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State Feedback Screen component view */
          <div className="py-32 text-center border border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium text-sm italic">
              Our engineering lab currently has no inventory matching these
              parameters.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}