"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Package,
  Star,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

import ProductCard from "@/components/shop/ProductCard";
import ProductReviewForm from "@/components/shop/ProductReviewForm";

export default function ProductDetailsClient({
  product,
  recommendations,
  reviews,
  hasPurchased,
  purchasedOrderId,
  userEmail,
}: any) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isNameExpanded, setIsNameExpanded] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];
  const activeImage = images[currentIndex];

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const formattedTotalPrice = Number(
    (product.offer_price || product.price) * quantity,
  ).toLocaleString();

  const handleAddToCartAction = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-24 md:pb-0">
      <style>{`
        .product-card:hover .product-img { transform: scale(1.05); }
        .product-img { transition: transform 0.35s ease; }
      `}</style>

      <main className="max-w-7xl mx-auto md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-24">
          {/* --- LEFT: GALLERY & TECHNICAL INFO --- */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-6">
              <div
                className="relative aspect-square w-full bg-slate-50 border border-slate-100 overflow-hidden p-10 md:p-16 group touch-pan-y"
                onTouchStart={(e) => {
                  const touchStartX = e.touches[0].clientX;
                  (e.currentTarget as any)._touchStartX = touchStartX;
                }}
                onTouchEnd={(e) => {
                  const touchStartX = (e.currentTarget as any)._touchStartX;
                  if (touchStartX === undefined) return;
                  const touchEndX = e.changedTouches[0].clientX;
                  const swipeDistance = touchStartX - touchEndX;
                  const swipeThreshold = 50;
                  if (swipeDistance > swipeThreshold) nextSlide();
                  else if (swipeDistance < -swipeThreshold) prevSlide();
                  delete (e.currentTarget as any)._touchStartX;
                }}
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain transition-all duration-500 select-none px-2"
                  priority
                  draggable={false}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-100 text-slate-800 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex cursor-pointer"
                    >
                      <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-100 text-slate-800 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex cursor-pointer"
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-mono text-xs font-bold tracking-widest shadow-sm select-none">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: PRICING & ACTIONS --- */}
          <div className="lg:col-span-5 px-3">
            <div className="lg:sticky lg:top-28 space-y-8">
              <div className="bg-white shadow-2xl shadow-slate-200/40 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-start gap-2 justify-between">
                    <h1
                      className={`text-xl md:text-5xl font-normal text-slate-900 leading-tight transition-all ${isNameExpanded ? "" : "line-clamp-2"}`}
                    >
                      {product.name}
                    </h1>
                    <button
                      onClick={() => setIsNameExpanded(!isNameExpanded)}
                      className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-colors mt-1 cursor-pointer"
                    >
                      <ChevronDown
                        size={24}
                        className={`transition-transform duration-300 ${isNameExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-slate-400 line-through">
                      ₦{Number(product.price).toLocaleString()}
                    </span>
                    {product.offer_price && (
                      <span className="text-2xl font-bold">
                        ₦{Number(product.offer_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Select Quantity
                    </label>
                    <div className="flex items-center w-full max-w-[180px] border border-emerald-900 rounded-xl p-1.5">
                      <button
                        onClick={decrement}
                        className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-600 hover:text-emerald-600 cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="flex-1 text-center font-black text-xl text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-600 hover:text-emerald-600 cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCartAction}
                    className="w-full bg-emerald-800 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 border border-emerald-900 hover:bg-emerald-900 active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingCart size={22} /> Add to Cart
                  </button>
                </div>

                <div className="space-y-6 pt-4 md:pt-0">
                  <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                    Description
                  </h2>
                  <p className="text-slate-700 text-[14px] leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {product.specs &&
                    Array.isArray(product.specs) &&
                    product.specs.length > 0 && (
                      <section className="mt-5">
                        <h2 className="text-2xl font-medium text-slate-800 mb-6">
                          Technical Specification
                        </h2>
                        <ul className="space-y-1 px-2 text-[14px]">
                          {product.specs.map((s: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-600 leading-relaxed"
                            >
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CUSTOMER REVIEWS --- */}
        {reviews && Array.isArray(reviews) && reviews.length > 0 && (
          <section className="mt-2 md:mt-32 pt-16 border-t border-slate-100 px-3 lg:px-0">
            <h2 className="text-2xl font-medium text-slate-900 mb-8 tracking-tight">
              Component Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {reviews.map((review: any) => {
                  const displayName = review.user_name || "User";
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <div
                      key={review.id}
                      className="pb-8 border-b border-slate-100 flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm flex-shrink-0">
                        {initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {displayName}
                        </h4>
                        <p className="text-sm text-slate-600 font-medium my-2 leading-relaxed">
                          {review.comment}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        {/* --- RECOMMENDATIONS --- */}
        {recommendations?.length > 0 && (
          <section className="mt-5 md:mt-24 pt-5 px-3 border-t border-slate-100">
            <h2 className="text-2xl font-medium text-slate-900 tracking-tighter mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-10">
              {recommendations.map((item: any) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* --- MOBILE STICKY BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50 p-4 md:hidden flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-700">
            Total
          </span>
          <p className="text-xl font-medium text-slate-900">
            ₦{formattedTotalPrice}
          </p>
        </div>
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={decrement}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center font-bold text-sm">{quantity}</span>
          <button
            onClick={increment}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={handleAddToCartAction}
          className="flex-1 bg-emerald-800 text-white font-bold h-11 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
