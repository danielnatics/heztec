import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Basic Stats (Example queries)
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  // You would add more specific queries for sales/orders here
  
  const stats = [
    { label: "Total Products", value: productCount || 0, icon: <Package />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "124", icon: <ShoppingCart />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Revenue", value: "₦1.2M", icon: <TrendingUp />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Low Stock", value: "3", icon: <AlertTriangle />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Welcome back, Daniel. Here is what's happening at HezTec.</p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS (Main Section) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-emerald-600" size={20} /> Recent Orders
            </h2>
            <button className="text-xs font-black uppercase text-emerald-700 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs text-slate-400">#HZ-7721</td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">Engineering Student</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-md">Processing</span>
                    </td>
                    <td className="px-8 py-4 text-right font-black text-slate-900 text-sm">₦15,000</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS / ALERTS */}
        <div className="space-y-6">
          <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -mr-16 -mt-16" />
            <h3 className="text-lg font-bold relative z-10">Quick Actions</h3>
            <div className="grid gap-3 relative z-10">
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                Print Shipping Labels <ArrowUpRight size={16} />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-all">
                Check Battery Stock
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Inventory Health</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700">ESP32 Modules</span>
                  <span className="text-xs font-black text-emerald-600">85% In Stock</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="w-[85%] h-full bg-emerald-500" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}