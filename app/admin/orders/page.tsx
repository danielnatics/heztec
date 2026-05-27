"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Loader2, Clock, CheckCircle2, XCircle, MapPin, 
  User, FileText, Send, Edit2, Save, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_email: string;
  total_amount: number;
  delivery_address: string;
  transfer_note: string | null;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Order marked as ${newStatus.replace("_", " ")}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o));
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveOrderEdits = async () => {
    if (!editingOrder?.id) return;
    setUpdatingId(editingOrder.id);
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          delivery_address: editingOrder.delivery_address,
          transfer_note: editingOrder.transfer_note,
          total_amount: editingOrder.total_amount
        })
        .eq("id", editingOrder.id);

      if (error) throw error;
      
      toast.success("Order details updated successfully!");
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...editingOrder } : o));
      setEditingOrder(null); 
    } catch (error: any) {
      toast.error("Failed to save edits: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) return;
    
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;
      
      toast.success("Order deleted permanently.");
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error: any) {
      toast.error("Failed to delete order: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === "pending_verification") return <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-md border border-amber-200"><Clock size={12} className="inline mr-1"/> Pending</span>;
    if (status === "confirmed") return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md border border-blue-200"><CheckCircle2 size={12} className="inline mr-1"/> Confirmed</span>;
    if (status === "completed") return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md border border-emerald-200"><Send size={12} className="inline mr-1"/> Completed</span>;
    if (status === "cancelled") return <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-black uppercase rounded-md border border-red-200"><XCircle size={12} className="inline mr-1"/> Cancelled</span>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-black text-slate-900 uppercase">Admin Order Fulfillment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col">
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">ID: {order.id.split('-')[0]}</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{new Date(order.created_at).toLocaleString('en-NG')}</p>
                </div>
                {renderStatusBadge(order.payment_status)}
              </div>

              {/* Editable Section */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100 relative group">
                {editingOrder?.id !== order.id && (
                  <button 
                    onClick={() => setEditingOrder(order)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit Order Details"
                  >
                    <Edit2 size={16} />
                  </button>
                )}

                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <User size={16} className="text-slate-400 mt-0.5" />
                  <span className="font-medium">{order.user_email}</span>
                </div>

                {editingOrder?.id === order.id ? (
                  <div className="space-y-3 pt-2">
                    <Textarea 
                      value={editingOrder.delivery_address} 
                      onChange={e => setEditingOrder({...editingOrder, delivery_address: e.target.value})}
                      placeholder="Delivery Address"
                      className="text-sm border-slate-200 bg-white"
                      rows={2}
                    />
                    <Input 
                      value={editingOrder.transfer_note || ""} 
                      onChange={e => setEditingOrder({...editingOrder, transfer_note: e.target.value})}
                      placeholder="Order Note"
                      className="text-sm border-slate-200 bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-600">Total (₦):</span>
                      <Input 
                        type="number"
                        value={editingOrder.total_amount || 0} 
                        onChange={e => setEditingOrder({...editingOrder, total_amount: parseFloat(e.target.value) || 0})}
                        placeholder="Total Amount"
                        className="text-sm border-slate-200 bg-white flex-1"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveOrderEdits} className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-bold">
                        {updatingId === order.id ? <Loader2 size={12} className="animate-spin"/> : <Save size={12} />} Save
                      </button>
                      <button onClick={() => setEditingOrder(null)} className="text-slate-500 text-xs font-bold px-2">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 text-sm text-slate-700">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <span className="font-medium">{order.delivery_address}</span>
                    </div>
                    {order.transfer_note && (
                      <div className="flex items-start gap-2 text-sm text-slate-700 pt-2 border-t border-slate-200">
                        <FileText size={16} className="text-slate-400 mt-0.5" />
                        <span className="font-medium italic">Note: {order.transfer_note}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 flex-1 border-b border-slate-100 pb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-800">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Action Controls */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-xl font-black text-slate-900">₦{order.total_amount.toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  {/* Status Change Buttons */}
                  {order.payment_status === "pending_verification" && (
                    <button onClick={() => updateOrderStatus(order.id, "confirmed")} disabled={updatingId === order.id} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg flex justify-center items-center gap-2">
                      {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Confirm Payment
                    </button>
                  )}

                  {order.payment_status === "confirmed" && (
                    <button onClick={() => updateOrderStatus(order.id, "completed")} disabled={updatingId === order.id} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-lg flex justify-center items-center gap-2">
                      {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Complete Order
                    </button>
                  )}

                  {/* Cancel Button */}
                  {(order.payment_status === "pending_verification" || order.payment_status === "confirmed") && (
                    <button onClick={() => updateOrderStatus(order.id, "cancelled")} disabled={updatingId === order.id} className="px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-lg" title="Cancel Order">
                      <XCircle size={16} />
                    </button>
                  )}

                  {/* Delete Button */}
                  <button onClick={() => deleteOrder(order.id)} disabled={updatingId === order.id} className="px-3 border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold py-2.5 rounded-lg transition-colors" title="Permanently Delete Order">
                    {updatingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}