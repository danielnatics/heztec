"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  PackageSearch, 
  Loader2, 
  Clock, 
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react";

// Define the shape of your order based on the database schema
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export default function UserOrdersPage() {
  const supabase = createClient();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login?redirect=/orders");
        return;
      }

      // Fetch orders for this specific user, newest first
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [supabase, router]);

  // Helper to render the correct status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            <Clock size={12} /> Pending Verification
          </span>
        );
      case "confirmed":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-200">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
            {status.replace("_", " ")}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 md:p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link
          href="/shop"
          className="inline-flex items-center px-4 pt-4 gap-2 text-slate-500 font-bold text-sm hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-normal px-4 text-slate-900">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200/80  md:rounded-xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="text-slate-400" size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No orders found</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders with HezTec yet. When you do, they will appear here so you can track their status.
            </p>
            <Link 
              href="/shop" 
              className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white mx-3 p-2 border border-slate-200/80 md:rounded-2xl py-4 md:p-6 shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col  sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Order ID: {order.id.split('-')[0]}...
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-NG', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    {renderStatusBadge(order.payment_status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-100">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid</span>
                  <span className="text-lg font-black text-slate-900">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}