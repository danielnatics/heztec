"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    offer_price?: number;
    images?: string[];
    category?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();

  // Find this specific item in the global cart array to get its current count
  const cartItem = cart.find((item) => item.id === product.id);
  const itemCount = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden border border-slate-100 rounded-2xl hover:shadow-md transition-all duration-300">
      {/* IMAGE CONTAINER WITH HOVER OVERLAY */}
      <Link
        href={`/shop/${product.id}`}
        className="relative aspect-square w-full bg-[#f4f4f4] overflow-hidden flex items-center justify-center p-2"
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <Package size={40} className="text-slate-200" />
        )}
      </Link>

      {/* METADATA & TEXT INFO */}
      <div className="pt-3 pb-4 px-3 flex flex-col flex-1">
        {/* Product Title */}
        <Link
          href={`/shop/${product.id}`}
          className="block group-hover:underline decoration-slate-400"
        >
          <h3 className="text-slate-800 text-sm font-normal leading-tight line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Dynamic Pricing Row */}
        <div className="flex items-center justify-between flex-wrap gap-x-2 mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">
              <span className="text-[13px] mr-0.5">₦</span>
              {Number(product.offer_price || product.price).toLocaleString()}
            </span>
            {product.offer_price && (
              <span className="text-xs text-slate-400 line-through">
                ₦{Number(product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Add To Cart Button with Absolute Floating Badge */}
          <button
            type="button"
            className="relative w-8 h-8 cursor-pointer border border-slate-300 rounded-full flex items-center justify-center text-slate-800 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 active:scale-95 transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
            
            {/* Counter Badge: Renders dynamically only if quantity > 0 */}
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-emerald-600 text-white font-mono text-[9px] font-black rounded-full flex items-center justify-center shadow-sm animate-in scale-in duration-200 select-none">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}