"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function FilterBar({ totalProducts }: { totalProducts: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL params without losing existing ones
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "newest") {
      params.delete(key); // Keep URL clean for default states
    } else {
      params.set(key, value);
    }
    router.push(`/marketplace/all?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";
  const currentAvailability = searchParams.get("availability") || "all";

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-slate-100 gap-4 bg-white">
      {/* LEFT: Filter Group */}
      <div className="flex items-center gap-6 md:gap-8 text-[13px] text-slate-500">
        <span className="font-medium text-slate-400">Filter:</span>
        
        {/* Availability Dropdown */}
        <div className="relative flex items-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors">
          <select 
            value={currentAvailability}
            onChange={(e) => updateFilter("availability", e.target.value)}
            className="appearance-none bg-transparent outline-none cursor-pointer pr-5 font-medium"
          >
            <option value="all">Availability</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <ChevronDown size={14} className="absolute right-0 pointer-events-none" />
        </div>

        {/* Price Placeholder (matches reference image style) */}
        <div className="relative flex items-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors">
          <span className="font-medium">Price</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* RIGHT: Sorting & Product Count */}
      <div className="flex items-center gap-6 md:gap-8 text-[13px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <div className="relative flex items-center gap-1">
            <select 
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="appearance-none bg-transparent outline-none cursor-pointer pr-5 font-bold text-slate-900"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price, low to high</option>
              <option value="price_high">Price, high to low</option>
              <option value="alpha_asc">Alphabetically, A-Z</option>
              <option value="alpha_desc">Alphabetically, Z-A</option>
            </select>
            <ChevronDown size={14} className="absolute right-0 pointer-events-none text-slate-900" />
          </div>
        </div>
        
        <span className="font-medium text-slate-400">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
        </span>
      </div>
    </div>
  );
}