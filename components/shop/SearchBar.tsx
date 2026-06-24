"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Reference to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. DEBOUNCED LIVE SEARCH
  useEffect(() => {
    // Wait 300ms after the user stops typing before hitting the database
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsLoading(true);

        // Fetch up to 5 matching product names
        const { data } = await supabase
          .from("products")
          .select("id, name")
          .ilike("name", `%${searchTerm.trim()}%`)
          .limit(5);

        setSuggestions(data || []);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, supabase]);

  // 2. CLICK OUTSIDE HANDLER
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. SUBMISSION HANDLER
  const handleSubmit = (e?: React.FormEvent, explicitTerm?: string) => {
    if (e) e.preventDefault();

    // Use the clicked suggestion if provided, otherwise use the typed input
    const finalTerm = explicitTerm !== undefined ? explicitTerm : searchTerm;
    const params = new URLSearchParams(searchParams.toString());

    if (finalTerm.trim()) {
      params.set("search", finalTerm.trim());
    } else {
      params.delete("search");
    }

    setShowSuggestions(false);
    router.push(`/shop/all?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-xl group" ref={dropdownRef}>
      {/* SEARCH INPUT FORM */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search
            size={18}
            className="text-slate-400 group-focus-within:text-green-600 transition-colors"
          />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Search microcontrollers, sensors, modules..."
          className="block w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 transition-all shadow-sm"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute inset-y-1.5 right-1.5 px-5 bg-slate-900 hover:bg-green-600 text-white text-xs font-bold tracking-wide rounded-xl transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* AUTOCOMPLETE DROPDOWN */}
      {showSuggestions && searchTerm.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-slate-400">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm(item.name);
                      handleSubmit(undefined, item.name);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between group/item transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover/item:text-green-700 transition-colors">
                      {item.name}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 group-hover/item:text-green-600 transition-colors"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-center text-slate-500 font-medium">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
