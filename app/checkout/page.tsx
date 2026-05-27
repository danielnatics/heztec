"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  MessageCircle,
  FileText,
  User,
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

  // Form states for delivery tracking records
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Secure Route Gatekeeper: Validate user session on load
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to complete your checkout process.");
        router.push("/login?redirect=/checkout");
      } else {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [supabase, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !deliveryAddress.trim()) {
      toast.warning("Please provide your name and a valid delivery address.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 1. Submit order records metadata payload into Supabase database
      // The status "pending_verification" allows you to view it on your admin panel and confirm payment later.
      const { error: orderError } = await supabase.from("orders").insert([
        {
          user_id: user?.id,
          user_email: user?.email,
          total_amount: cartTotal,
          delivery_address: deliveryAddress,
          payment_method: "whatsapp_checkout",
          payment_status: "pending_verification",
          transfer_note: orderNote || null,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.offer_price || item.price,
          })),
          created_at: new Date().toISOString(),
        },
      ]);

      if (orderError) throw orderError;

      // 2. Format the WhatsApp Message Bundle
      const whatsappMessage = `
*Name:* ${customerName}
*Delivery Address:* ${deliveryAddress}
*Note:* ${orderNote || "N/A"}

*Order Summary:*
${cart.map((item) => `${item.quantity}x ${item.name} (₦${((item.offer_price || item.price) * item.quantity).toLocaleString()})`).join("\n")}

*Total Amount:* ₦${cartTotal.toLocaleString()}
`;

      // 3. Encode the string and redirect to WhatsApp
      const whatsappUrl = `https://wa.me/2348130123588?text=${encodeURIComponent(whatsappMessage)}`;

      toast.success(
        "Order logged! Redirecting to WhatsApp to complete payment.",
      );

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");

      // Clear the cart and send them back to the shop
      clearCart();
      router.push("/shop");
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
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- LEFT SIDE: LOGISTICS ADDRESS & CHECKOUT FORM --- */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="md:text-3xl text-2xl font-black text-slate-900 tracking-tight ">
              Checkout
            </h1>

            <div className="bg-white border border-slate-200/80 p-4 shadow-sm">
              <div className="mb-6 space-y-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Delivery Details
                </h2>
                <p className="text-sm text-slate-500">
                  Fill in your delivery information to log your order. You will
                  be redirected to WhatsApp to arrange payment.
                </p>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-wider text-slate-400"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      id="name"
                      required
                      placeholder="Alex Dave"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="pl-10 h-12 bg-slate-50/50  rounded-xl font-medium focus-visible:ring-green-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-[10px] font-black uppercase tracking-wider text-slate-400"
                  >
                    Delivery / Lab Location Address
                  </Label>
                  <Textarea
                    id="address"
                    required
                    rows={3}
                    placeholder="Your Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="bg-slate-50/50 border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-green-600 leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="note"
                    className="text-[10px] font-black uppercase tracking-wider text-slate-400"
                  >
                    Additional Note (Optional)
                  </Label>
                  <div className="relative">
                    <FileText
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      id="note"
                      placeholder="Any special instructions for this order?"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 group text-sm cursor-pointer disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>please wait</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      <span>Place Order</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* --- RIGHT SIDE: ORDER CONTENT SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">
                Item Manifest Summary ({cartCount})
              </h2>

              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3 divide-y divide-slate-50">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center pt-3 first:pt-0"
                  >
                    <div className="relative w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden p-0.5 flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ₦
                      {(
                        (item.offer_price || item.price) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-[10px] text-emerald-800 leading-relaxed font-medium">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="font-bold uppercase tracking-wider block mb-0.5">
                      Secure Transaction
                    </span>
                    Clicking submit logs your order in our database as pending
                    and redirects you to WhatsApp with your full order details
                    ready to send.
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
