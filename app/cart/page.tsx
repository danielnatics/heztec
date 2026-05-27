"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Read current active session parameters
  useEffect(() => {
    async function getAuthStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    }
    getAuthStatus();
  }, [supabase]);

  const handleCheckout = () => {
    if (!user) {
      router.push(`/login?redirect=/cart`);
      return;
    }
    // Route customer directly to secure billing gateway logic
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300 shadow-sm">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h1>
        <p className="text-slate-500 font-medium text-sm mt-2 max-w-sm">
          You haven't added any electronics components or battery assets to your current manifest yet.
        </p>
        <Link href="/shop/all" className="mt-6">
          <Button className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl px-6 h-12">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* LEFT COLUMN: ITEMS VIEW MANIFEST */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-end justify-between pt-10 px-4">

          <h1 className="text-3xl text-slate-900 tracking-tight flex items-center gap-3">
            Your cart 
          </h1>
          <div>
             <Link
              href="/shop/all"
              className="md:inline-flex items-center text-sm font-bold text-slate-500 hover:text-green-700 hover:underline transition-colors group"
            >
              Continue shopping
              {/* <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              /> */}
            </Link>
          </div>
          
          </div>

          <div className="bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const activePrice = item.offer_price || item.price;
              return (
                <div key={item.id} className="p-4 md:p-6 flex gap-4 md:gap-6 items-center">
                  {/* Aspect Thumbnail Area */}
                  <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0 p-1">
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Main Descriptive Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-slate-900 text-sm md:text-base truncate hover:text-emerald-700 transition-colors">
                      <Link href={`/shop/${item.id}`}>{item.name}</Link>
                    </h3>
                    <div className="text-sm font-normal text-slate-900">
                      ₦{activePrice.toLocaleString()}{" "}
                      {item.offer_price && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">
                          ₦{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls Interface Array Row */}
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-8">
                    {/* Quantity Adjustment Selector Container */}
                    <div className="flex items-center border border-slate-400  p-1 bg-slate-30">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-emerald-700 active:scale-90"
                        type="button"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 active:scale-90"
                        type="button"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Trash Delete Action Trigger */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-9 h-9 border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: PRICING BREAKDOWN CARD */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
            <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">Order Summary</h2>
            
            <div className="space-y-3 font-medium text-sm text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold text-slate-900">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes and Shipping</span>
                <span className="text text-xs font-bold tracking-wider px-2 py-0.5">calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base"> Total</span>
              <span className="text-2xl font-bold text-slate-900">₦{cartTotal.toLocaleString()} NGN</span>
            </div>

            {/* Authentication Feedback Notice Banner */}
            {!user && !checkingAuth && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 leading-relaxed font-medium">
                <ShieldCheck size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider block mb-0.5">Authentication Required</span>
                  Please sign in to secure your order details and link up delivery addresses.
                </div>
              </div>
            )}

            {/* Checkout Action Handler Button */}
            <Button
              onClick={handleCheckout}
              disabled={checkingAuth}
              className="w-full bg-emerald-950 text-white font-bold h-14 hover:bg-emerald-900 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm"
            >
              {user ? "Check out" : "Sign In to Checkout"}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}