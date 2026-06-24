import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Product Count
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 2. Fetch All Orders for Stats and Recent Table
  const { data: orders } = await supabase
    .from("orders")
    .select("id, user_email, total_amount, payment_status, created_at")
    .order("created_at", { ascending: false });

  // 3. Calculate Dynamic Stats
  const totalOrders = orders?.length || 0;

  // Calculate revenue (only summing orders that are confirmed or completed)
  const totalRevenue =
    orders
      ?.filter(
        (o) =>
          o.payment_status === "completed" ||
          o.payment_status === "confirmed" ||
          o.payment_status === "delivered",
      )
      .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

  // Get the 5 most recent orders for the table
  const recentOrders = orders?.slice(0, 5) || [];

  const stats = [
    {
      label: "Total Products",
      value: productCount || 0,
      icon: <Package />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Low Stock",
      value: "3",
      icon: <AlertTriangle />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    }, // You can make this dynamic later
  ];

  // Helper for status badge colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "bg-amber-100 text-amber-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back, Daniel. Here is what's happening at HezTec.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5"
          >
            <div
              className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-8 text-center text-slate-500 text-sm font-medium"
                    >
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-4 font-mono text-xs text-slate-400">
                        #{order.id.split("-")[0]}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm truncate max-w-[150px]">
                        {order.user_email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-[9px] font-black uppercase rounded-md ${getStatusStyle(order.payment_status)}`}
                        >
                          {order.payment_status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right font-black text-slate-900 text-sm">
                        ₦{order.total_amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
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
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
              Inventory Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-700">
                  ESP32 Modules
                </span>
                <span className="text-xs font-black text-emerald-600">
                  85% In Stock
                </span>
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
