"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ShopControls({ 
  activeSearch, 
  activeCategory, 
  activeSort, 
  categories,
  productCount 
}: {
  activeSearch: string;
  activeCategory: string;
  activeSort: string;
  categories: string[];
  productCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState(activeSearch);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live matching suggestions dynamically as the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("id, name, images, category")
        .ilike("name", `%${searchQuery}%`)
        .limit(5);
      
      setSuggestions(data || []);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, supabase]);

  // Unified parameter updater for category, search, and sorting
  const updateParams = (changes: Record<string, string>) => {
    const current = { search: activeSearch, category: activeCategory, sort: activeSort };
    const updated = { ...current, ...changes };
    const query = new URLSearchParams();

    if (updated.search) query.set("search", updated.search);
    if (updated.category && updated.category !== "all") query.set("category", updated.category);
    if (updated.sort && updated.sort !== "random") query.set("sort", updated.sort);

    const queryString = query.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchQuery });
    setIsSuggestionsOpen(false);
  };

  return (
    <div className="flex flex-col border-slate-100 mb-5">
      
      {/* --- TOP ROW: PAGE TITLE & LIVE SEARCH BAR --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <div className="flex items-end justify-between">
          <h1 className="text-slate-900 font-normal text-2xl md:text-4xl tracking-tight">
            All Products
          </h1>
          <p className="text-xs text-slate-400 font-normal tracking-wider mt-1">
            {productCount}results
          </p>
        </div>

        <div className="relative w-full lg:max-w-md" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSuggestionsOpen(true);
              }}
              onFocus={() => setIsSuggestionsOpen(true)}
              placeholder="Search components"
              className="w-full h-12 pl-11 pr-10 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-green-500 bg-slate-50/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateParams({ search: "" });
                  setIsSuggestionsOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Live Search Suggestions Dropdown Matrix */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pt-3 pb-2 bg-slate-50/50 border-b border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Matching Hardware
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                    onClick={() => setIsSuggestionsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden relative bg-white border border-slate-100 p-1">
                      <Image
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] font-semibold text-green-600 mt-0.5">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM ROW: FILTER TOOLBAR --- */}
      <div className="hidden bg-slate-50 p-4 rounded-2xl border border-slate-100">
        
        {/* Mobile Filter Collapsible Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden flex items-center justify-between w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
          type="button"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-green-600" /> Filters & Sorting
          </span>
          <ChevronDown size={16} className={cn("transition-transform", isMobileFilterOpen ? "rotate-180" : "")} />
        </button>

        {/* Dynamic Controls Layout (Collapsible on Mobile, Horizontal on Desktop) */}
        <div className={cn("flex-col md:flex-row md:flex items-center justify-between gap-4 mt-4 md:mt-0", isMobileFilterOpen ? "flex" : "hidden")}>
          
          {/* CATEGORY FILTER */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">Category:</span>
            <select
              value={activeCategory}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="h-10 md:h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs outline-none cursor-pointer w-full md:w-auto focus:border-green-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* SORT FILTER */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">Sort:</span>
            <select
              value={activeSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="h-10 md:h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs outline-none cursor-pointer w-full md:w-auto focus:border-green-500 transition-colors"
            >
              <option value="random">Randomized</option>
              <option value="newest">Newest Stock</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="alpha_asc">Alphabetical</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  ); 
}