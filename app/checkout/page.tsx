"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Coins, 
  ShieldCheck, 
  Loader2, 
  Send, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  // Form states for delivery tracking records
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [transferNote, setTransferNote] = useState("");

  const bankDetails = {
    accountNumber: "9116319581",
    accountName: "Egwuatu Daniel Chibuzor",
    bankName: "OPAY",
  };

  // Secure Route Gatekeeper: Validate user session on load
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to complete your checkout process.");
        router.push("/login?redirect=/checkout");
      } else {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [supabase, router]);

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.accountNumber);
      setCopiedText(true);
      toast.success("Account number copied to clipboard!");
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      toast.warning("Please provide a valid delivery or laboratory address.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Submit order records metadata payload into Supabase database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user?.id,
            user_email: user?.email,
            total_amount: cartTotal,
            delivery_address: deliveryAddress,
            payment_method: "bank_transfer",
            payment_status: "pending_verification",
            transfer_note: transferNote || null,
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.offer_price || item.price
            })),
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      toast.success("Order placed successfully! Awaiting bank transfer verification.");
      clearCart();
      router.push("/shop/all");
    } catch (err: any) {
      toast.error("Order processing error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation back anchor linkage */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Manifest Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT SIDE: PAYMENT SPECIFICATIONS & LOGISTICS ADDRESS --- */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Checkout Desk</h1>
            
            {/* Bank Transfer Information Block */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-900 uppercase">
                <Coins size={16} className="text-green-600" /> Manual Bank Transfer Details
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Please transfer the exact order subtotal to the official business payment profile listed below. Your items will be processed immediately upon payment verification.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm select-all">{bankDetails.accountNumber}</span>
                    <button 
                      type="button" 
                      onClick={handleCopyClipboard}
                      className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-green-600 transition-colors cursor-pointer"
                    >
                      {copiedText ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Account Name</span>
                  <span className="font-bold text-slate-900 text-right select-all">{bankDetails.accountName}</span>
                </div>

                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Bank Terminal</span>
                  <span className="font-bold text-slate-900 uppercase tracking-wide">{bankDetails.bankName}</span>
                </div>
              </div>
            </div>

            {/* Logistics/Delivery Form Section */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Delivery / Lab Location Address
                  </Label>
                  <Textarea 
                    id="address" 
                    required 
                    rows={3}
                    placeholder="Enter your comprehensive delivery coordinates or institutional lab center location..." 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="bg-slate-50/50 border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-green-600 leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Payment Note / Sender Name (Optional)
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input 
                      id="note" 
                      placeholder="e.g., Transferred from John Doe Account" 
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 group text-sm cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>LOGGING MANIFEST...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>SUBMIT COMPONENT ORDER</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* --- RIGHT SIDE: ORDER CONTENT SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">Item Manifest Summary ({cartCount})</h2>
              
              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3 divide-y divide-slate-50">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center pt-3 first:pt-0">
                    <div className="relative w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden p-0.5 flex-shrink-0">
                      <img src={item.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ₦{((item.offer_price || item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Total Due</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">₦{cartTotal.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-[10px] text-emerald-800 leading-relaxed font-medium">
                  <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block mb-0.5">Secure Transaction</span>
                    Your order details will be saved to the database. Verification will proceed within 24 hours of form submission.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}