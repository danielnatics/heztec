"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  Search,
  ArrowRight,
  Cpu,
  Package,
  Home,
  Phone,
  Info,
  BookOpen
} from "lucide-react";
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

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) { setSuggestions([]); return; }
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

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navLinks = [
    { name: "Home",     href: "/",        icon: <Home size={17} /> },
    { name: "Shop",     href: "/shop",     icon: <Package size={17} /> },
    { name: "Services", href: "/services", icon: <Cpu size={17} /> },
    { name: "Blog", href: "/blog", icon: <BookOpen size={17} /> },
    { name: "About",    href: "/about",    icon: <Info size={17} /> },
    { name: "Contact",  href: "/contact",  icon: <Phone size={17} /> },
  ];

  const serviceLinks = [
    { name: "PCB Design",       href: "/services" },
    { name: "Embedded & IoT",   href: "/services" },
    { name: "3D Printing",      href: "/services" },
    { name: "Component Sales",  href: "/shop"     },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">

            {/* HAMBURGER */}
            <div className="flex lg:hidden flex-1">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* LOGO */}
            <div className="flex-none md:flex-1 flex justify-center md:justify-start">
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="HezTec" width={50} height={50} className="object-contain" />
                <div className="flex flex-col leading-none">
                  <span className="text-[17px] font-black tracking-tight text-slate-900">HezTec</span>
                  <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "#16a34a" }}>
                    Engineered Excellence
                  </span>
                </div>
              </Link>
            </div>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex items-center gap-0.5 text-sm font-semibold">
              {navLinks.filter(l => l.name !== "Home").map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full transition-all",
                    isActive(link.href)
                      ? "bg-green-50 text-green-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* UTILITY */}
            <div className="flex flex-1 justify-end items-center gap-0.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <Search size={19} strokeWidth={2} />
              </button>
              <Link
                href="/shop/cart"
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all relative"
              >
                <ShoppingBag size={19} strokeWidth={2} />
              </Link>
              {userEmail ? (
                <Link
                  href="/admin"
                  className="ml-1 p-2 rounded-full transition-all"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
                >
                  <LayoutDashboard size={17} />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ml-1 p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  <User size={19} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── SIDEBAR BACKDROP ─────────────────────────────────── */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 z-[150] transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      />

      {/* ── SIDEBAR DRAWER ───────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 h-full z-[160] flex flex-col transition-transform duration-300 ease-in-out bg-white"
        style={{
          width: 288,
          borderRight: "1px solid #f1f5f9",
          boxShadow: "4px 0 40px rgba(0,0,0,0.08)",
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
            <Image src="/logo.png" alt="HezTec" width={34} height={34} className="object-contain" />
            <div className="leading-none">
              <p className="font-black text-[15px] tracking-tight text-slate-900">HezTec</p>
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: "#16a34a" }}>
                Engineered Excellence
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                isActive(link.href)
                  ? "bg-green-50 text-green-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              style={{
                borderLeft: isActive(link.href) ? "2px solid #16a34a" : "2px solid transparent",
              }}
            >
              <span className={isActive(link.href) ? "text-green-600" : "text-slate-400"}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}

          {/* Services sub-links */}
          <div className="pt-5 pb-1">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 mb-2">
              Services
            </p>
            {serviceLinks.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all text-white"
            style={{ background: "#16a34a" }}
          >
            Start a Project <ArrowRight size={15} />
          </Link>

          {userEmail ? (
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border transition-all"
              style={{ borderColor: "#bbf7d0", color: "#16a34a", background: "#f0fdf4" }}
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              <User size={15} /> Sign In
            </Link>
          )}

          <p className="text-center text-[10px] text-slate-300 pt-1">© 2026 HezTec Innovation</p>
        </div>
      </aside>

      {/* ── SEARCH OVERLAY ───────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[200] transition-all duration-300 p-4"
        style={{
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(6px)",
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? "auto" : "none",
        }}
      >
        <div
          className="w-full max-w-2xl mx-auto mt-16 bg-white overflow-hidden transition-all duration-300 shadow-2xl"
          style={{
            borderRadius: 20,
            border: "1px solid #f1f5f9",
            transform: isSearchOpen ? "translateY(0)" : "translateY(-16px)",
          }}
        >
          {/* Input row */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3 px-5 py-4 border-b border-slate-100"
          >
            <Search size={19} className="text-green-600 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for components..."
              className="flex-1 bg-transparent text-[17px] outline-none font-medium text-slate-900 placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={15} />
            </button>
          </form>

          {/* Results */}
          {searchQuery.length >= 2 && (
            <div className="max-h-[380px] overflow-y-auto">
              {suggestions.length > 0 ? (
                <>
                  <div className="px-5 pt-4 pb-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                      Matching Products
                    </p>
                  </div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/shop/${item.id}`}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50"
                    >
                      <div className="w-11 h-11 flex-shrink-0 rounded-xl overflow-hidden relative bg-slate-100">
                        <Image
                          src={item.images?.[0] || "/placeholder.png"}
                          alt=""
                          fill
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors"
                  >
                    See all results for "{searchQuery}" <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <div className="py-14 text-center">
                  <ShoppingBag size={36} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-400">
                    No components found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Popular tags */}
          {searchQuery.length === 0 && (
            <div className="px-5 py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["ESP32", "Arduino", "OLED Display", "LiFePO4", "Servo Motor", "STM32"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchQuery(t)}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}