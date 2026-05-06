"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  PlusCircle, 
  LayoutDashboard, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Product List", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Add Product", href: "/admin/products/new", icon: <PlusCircle size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* MOBILE TRIGGER: Shown only on small screens */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-emerald-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black">H</div>
            <span className="font-black tracking-tight text-lg">HezTec Admin</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                    ${isActive 
                      ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20" 
                      : "text-emerald-100/60 hover:bg-white/5 hover:text-white"}
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 text-[10px] font-bold text-emerald-100/30 uppercase tracking-widest text-center">
            HezTec v2.0 - Ado, NG
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Top Header for Mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <span className="font-black text-emerald-950">HezTec</span>
          <span className="text-xs font-bold text-slate-400 uppercase">
            {navItems.find(i => i.href === pathname)?.name || "Admin"}
          </span>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* OVERLAY: Closes sidebar when clicking outside on mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}