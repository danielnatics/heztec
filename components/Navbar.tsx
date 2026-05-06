"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  User,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/marketplace");

  // Handle Live Search Suggestions
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
        .limit(4);
      setSuggestions(data || []);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, supabase]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Services", href: "/services" },
    { name: "Technical Help", href: "/support" },
  ];

  return (
    <>
      <nav className="border-b bg-white/80 backdrop-blur-xl border-slate-200/60 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* MOBILE HAMBURGER */}
            <div className="flex md:hidden flex-1">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

            {/* LOGO */}
            <div className="flex-none md:flex-1 flex justify-center md:justify-start">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/logo_heztec.png" alt="HezTec" width={38} height={34} />
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">HezTec</span>
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.3em]">Innovation</span>
                </div>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-1 text-sm font-bold">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={cn("px-5 py-2.5 rounded-full transition-all", pathname === link.href ? "bg-emerald-950 text-white" : "text-slate-600 hover:text-emerald-600")}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* UTILITY */}
            <div className="flex flex-1 justify-end items-center gap-1">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <Search size={22} strokeWidth={2.5} />
              </button>
              
              <Link href="/marketplace/cart" className="p-2.5 text-slate-900 hover:bg-slate-100 rounded-full relative">
                <ShoppingBag size={22} strokeWidth={2.5} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </Link>

              {userEmail ? (
                <Link href="/admin" className="ml-2 bg-slate-900 p-2 rounded-full text-emerald-400">
                  <LayoutDashboard size={18} />
                </Link>
              ) : (
                <Link href="/login" className="p-2.5 text-slate-900"><User size={22} /></Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- SEARCH OVERLAY (The Image Requirement) --- */}
      <div className={cn(
        "fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm transition-all duration-300",
        isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div className={cn(
          "bg-white w-full max-w-4xl mx-auto mt-0 md:mt-10 md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform",
          isSearchOpen ? "translate-y-0" : "-translate-y-10"
        )}>
          {/* Search Input Area */}
          <div className="p-6 border-b flex items-center gap-4">
            <Search className="text-slate-400" size={24} />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for components, sensors, or services..."
                className="w-full text-xl md:text-2xl font-bold outline-none placeholder:text-slate-300 text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Results Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 h-[450px]">
            {/* Suggested Categories */}
            <div className="p-8 border-r border-slate-50 bg-slate-50/30">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trending Hardware</span>
               <div className="mt-6 space-y-4">
                  {['ESP32 Modules', 'LiFePO4 Cells', 'OLED Displays', 'Custom PCB Printing'].map((item) => (
                    <button 
                      key={item}
                      onClick={() => { setSearchQuery(item); handleSearchSubmit(); }}
                      className="block text-lg font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
               </div>
            </div>

            {/* Live Product Results */}
            <div className="p-8 space-y-6 overflow-y-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Matching Products</span>
              {suggestions.length > 0 ? (
                <div className="space-y-6">
                  {suggestions.map((item) => (
                    <Link 
                      key={item.id} 
                      href={`/marketplace/${item.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 relative overflow-hidden p-2">
                        <Image src={item.images?.[0] || "/placeholder.png"} alt="" fill className="object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={48} className="text-slate-200 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Start typing to see hardware...</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <button 
            onClick={handleSearchSubmit}
            className="w-full bg-slate-50 p-4 text-center text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            See all results for "{searchQuery || '...'}" <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}