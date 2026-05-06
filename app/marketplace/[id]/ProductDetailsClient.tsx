"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  MessageCircle,
  Minus,
  Plus,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";

export default function ProductDetailsClient({
  product,
  recommendations,
}: any) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || "/placeholder.png",
  );

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link
            href="/marketplace"
            className="hover:text-emerald-600 transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-emerald-600 truncate max-w-[100px] md:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-12 gap-16 lg:gap-24">
          {/* --- LEFT: GALLERY & TECHNICAL INFO --- */}
          <div className="lg:col-span-7 space-y-16">
            {/* Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square w-full  bg-slate-50 border border-slate-100 overflow-hidden p-10 md:p-16">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain transition-all duration-700"
                  priority
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex flex-wrap gap-4">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? "border-emerald-500 ring-4 ring-emerald-50"
                          : "border-slate-100 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Deep Description */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                Product Overview
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {product.description ||
                  "High-performance engineering component sourced and tested at HezTec Innovation Labs."}
              </p>

              {/* Technical Specifications Table */}
              {/* DYNAMIC TECHNICAL SPECIFICATIONS SECTION */}
              {/* TECHNICAL SPECIFICATION UNORDERED LIST */}
              <section className="mt-10">
                <h2 className="text-2xl font-medium text-slate-800 mb-6">
                  Technical Specification
                </h2>

                <ul className="space-y-3 px-2">
                  {product.specs &&
                  Array.isArray(product.specs) &&
                  product.specs.length > 0 ? (
                    product.specs.map((sentence: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-slate-600 leading-relaxed"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        <span className="text-lg">{sentence}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">
                      No specifications provided.
                    </li>
                  )}
                </ul>
              </section>
              {/* <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
                <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
                  <Zap className="text-emerald-400" size={20} /> Engineering Specs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-white/10 pt-8 relative z-10">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Category</span>
                    <span className="font-bold text-sm">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Quality Grade</span>
                    <span className="font-bold text-sm text-emerald-400">Lab Tested</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Product ID</span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase">{product.id.substring(0, 8)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">HezTec Status</span>
                    <span className="font-bold text-sm text-emerald-400">In Stock</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* --- RIGHT: PRICING & ACTIONS --- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              <div className="bg-white p-10  shadow-2xl shadow-slate-200/40 space-y-10">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-4xl font-black text-emerald-600">
                      ₦
                      {Number(
                        product.offer_price || product.price,
                      ).toLocaleString()}
                    </span>
                    {product.offer_price && (
                      <span className="text-xl text-slate-300 line-through font-bold">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Select Quantity
                  </label>
                  <div className="flex items-center w-full max-w-[180px] bg-slate-50 border border-slate-100 rounded-2xl p-1.5">
                    <button
                      onClick={decrement}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-emerald-600 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-black text-xl text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={increment}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-emerald-600 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="w-full bg-emerald-950 text-white font-black py-6 rounded-[1.5rem] hover:bg-emerald-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-[0.98]">
                    <ShoppingCart size={22} /> Add to Cart
                  </button>
                  <Link
                    href={`https://wa.me/2348130123588?text=Hello HezTec, I want to order ${quantity} units of ${product.name}`}
                    target="_blank"
                    className="w-full bg-white border-2 border-slate-200 text-slate-900 font-black py-6 rounded-[1.5rem] hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <MessageCircle size={22} /> Direct Lab Inquiry
                  </Link>
                </div>

                <div className="pt-8 border-t border-slate-100 flex items-center gap-4 justify-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-emerald-500" />{" "}
                    Professional Grade
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Zap size={16} className="text-emerald-500" /> Expert
                    Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RECOMMENDATIONS (YOU MAY ALSO LIKE) --- */}
        {recommendations && recommendations.length > 0 && (
          <section className="mt-32 md:mt-48 pt-20 border-t border-slate-100">
            <div className="flex items-end justify-between mb-12 px-2">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  You May Also Like
                </h2>
                <p className="text-slate-500 font-bold text-sm">
                  Complementary hardware for your engineering projects.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="hidden md:flex items-center gap-2 text-sm font-black uppercase text-emerald-700 group tracking-widest"
              >
                Browse More{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {recommendations.map((item: any) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
