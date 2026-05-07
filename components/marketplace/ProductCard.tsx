"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price?: number;
  images: string[];
  category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.offer_price || product.price;
  const hasDiscount = product.offer_price && product.offer_price < product.price;

  return (
    <div className="group bg-slate-50 rounded-2xl border border-slate-100 duration-500">
      {/* Image Container */}
      <Link href={`/marketplace/${product.id}`} className="block relative aspect-square mb-4  rounded-xl overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain "
        />
      </Link>

      {/* Product Details */}
      <div className="space-y-2">
        {/* <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
          {product.category || "General"}
        </span> */}
        
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="font-bold text-slate-900 text-sm group-hover:underline transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">
              ₦{displayPrice.toLocaleString()}
            </span>
            {/* {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through font-bold">
                ₦{product.price.toLocaleString()}
              </span>
            )} */}
          </div>
          
          {/* <button className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90">
            <ShoppingCart size={18} />
          </button> */}
        </div>
      </div>
    </div>
  );
}