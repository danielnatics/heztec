"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Cpu,
  Package,
  Home,
  Phone,
  Info,
  BookOpen,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

const ALLOWED_ADMIN_EMAIL = "getheztec@gmail.com";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const pathname = usePathname();

  const { cartCount } = useCart();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email || null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Signed out successfully from HezTec session.");
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      window.location.href = "/";
    } catch (err: any) {
      toast.error("Sign Out Error: " + err.message);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={17} /> },
    { name: "Shop", href: "/shop", icon: <Package size={17} /> },
    { name: "Services", href: "/services", icon: <Cpu size={17} /> },
    { name: "Blog", href: "/blog", icon: <BookOpen size={17} /> },
    { name: "About", href: "/#", icon: <Info size={17} /> },
    { name: "Contact", href: "/contact", icon: <Phone size={17} /> },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isAdmin = userEmail === ALLOWED_ADMIN_EMAIL;

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* HAMBURGER */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* LOGO */}
            <div className="flex-none flex justify-center md:justify-start">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="HezTec"
                  width={35}
                  height={35}
                  className="object-cover mr-2"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[17px] font-bold tracking-tight text-slate-900">
                    HezTec
                  </span>
                  <span
                    className="text-[11px] font-normal tracking-[0.18em] uppercase"
                    style={{ color: "#16a34a" }}
                  >
                    innovation
                  </span>
                </div>
              </Link>
            </div>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex items-center gap-0.5 text-sm font-semibold">
              {navLinks
                .filter((l) => l.name !== "Home")
                .map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full transition-all",
                      isActive(link.href)
                        ? "bg-green-50 text-green-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>

            {/* UTILITY BAR SYSTEM */}
            <div className="flex justify-end items-center gap-0.5">
              {/* SHOPPING BAG */}
              <Link
                href="/cart"
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all relative group mr-1"
              >
                <ShoppingBag size={19} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-green-600 text-white font-mono text-[9px] font-normal rounded-full flex items-center justify-center shadow-sm select-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* DESKTOP ACCOUNT DROPDOWN */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer select-none",
                    userEmail
                      ? "bg-green-50 text-green-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                  )}
                >
                  <User size={19} strokeWidth={userEmail ? 2.5 : 2} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-[110]">
                    {userEmail ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-slate-50">
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Account Session
                          </p>
                          <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                            {userEmail}
                          </p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <LayoutDashboard
                              size={16}
                              className="text-slate-400"
                            />{" "}
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <Package size={20} className="text-slate-400" />
                          <span className="md:inline text-sm">
                            My Orders
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-50 cursor-pointer"
                        >
                          <LogOut size={16} />Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-slate-50">
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Welcome
                          </p>
                        </div>
                        <Link
                          href="/login"
                          className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-colors"
                        >
                          <LogIn size={16} className="text-slate-400" /> Sign In
                          / Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR BACKDROP */}
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

      {/* SIDEBAR DRAWER */}
      <aside
        className="fixed top-0 left-0 h-full z-[160] flex flex-col transition-transform duration-300 ease-in-out bg-white"
        style={{
          width: 288,
          borderRight: "1px solid #f1f5f9",
          boxShadow: "4px 0 40px rgba(0,0,0,0.08)",
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="HezTec"
              width={34}
              height={34}
              className="object-contain"
            />
            <div className="leading-none">
              <p className="font-black text-[15px] tracking-tight text-slate-900">
                HezTec
              </p>
              <p
                className="text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5"
                style={{ color: "#16a34a" }}
              >
                Engineered Excellence
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

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
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
              style={{
                borderLeft: isActive(link.href)
                  ? "2px solid #16a34a"
                  : "2px solid transparent",
              }}
            >
              <span
                className={
                  isActive(link.href) ? "text-green-600" : "text-slate-400"
                }
              >
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "#16a34a" }}
          >
            Start a Project <ArrowRight size={15} />
          </Link>

          {userEmail ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border"
                  style={{
                    borderColor: "#bbf7d0",
                    color: "#16a34a",
                    background: "#f0fdf4",
                  }}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut size={15} /> Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <LogIn size={15} /> Sign In / Register
            </Link>
          )}
          <p className="text-center text-[10px] text-slate-300 pt-1">
            © 2026 HezTec Innovation
          </p>
        </div>
      </aside>
    </>
  );
}
