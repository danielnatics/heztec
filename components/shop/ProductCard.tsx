// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ShoppingCart, Eye } from "lucide-react";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   offer_price?: number;
//   images: string[];
//   category?: string;
// }

// export default function ProductCard({ product }: { product: Product }) {
//   const displayPrice = product.offer_price || product.price;
//   const hasDiscount = product.offer_price && product.offer_price < product.price;

//   return (
//     <div className="group bg-slate-50 rounded-2xl border border-slate-100 duration-500">
//       {/* Image Container */}
//       <Link href={`/marketplace/${product.id}`} className="block relative aspect-square mb-4  rounded-xl overflow-hidden">
//         <Image
//           src={product.images?.[0] || "/placeholder.png"}
//           alt={product.name}
//           fill
//           className="object-contain "
//         />
//       </Link>

//       {/* Product Details */}
//       <div className="space-y-2">
//         {/* <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
//           {product.category || "General"}
//         </span> */}

//         <Link href={`/shop/${product.id}`}>
//           <h3 className="font-bold text-slate-900 text-sm group-hover:underline transition-colors">
//             {product.name}
//           </h3>
//         </Link>

//         <div className="flex items-center justify-between pt-2">
//           <div className="flex flex-col">
//             <span className="text-lg font-black text-slate-900">
//               ₦{displayPrice.toLocaleString()}
//             </span>
//             {/* {hasDiscount && (
//               <span className="text-[10px] text-slate-400 line-through font-bold">
//                 ₦{product.price.toLocaleString()}
//               </span>
//             )} */}
//           </div>

//           {/* <button className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90">
//             <ShoppingCart size={18} />
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Eye, ShoppingCart, Flame, Star } from "lucide-react";

// Define what props our card expects
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    offer_price?: number;
    images?: string[];
    category?: string;
    sales_count?: string;
    reviews_count?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Mock fallback metrics to match your layout reference precisely
  const salesCount = product.sales_count || "1.2K+";
  const ratingStars = 5;
  const reviewCount = product.reviews_count || "245";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Replace with your actual cart state/context function if you have one
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden  transition-all duration-300">
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
            className="object-contain transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <Package size={40} className="text-slate-200" />
        )}

        {/* Quick look Button Overlay */}
        {/* <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-full px-4 py-1.5 flex items-center gap-1.5 text-slate-800 text-xs font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} strokeWidth={2.5} />
            <span>Quick look</span>
          </div>
        </div> */}
      </Link>

      {/* METADATA & TEXT INFO */}
      <div className="pt-3 pb-4 px-2 flex flex-col flex-1">
        {/* Product Title */}
        <Link
          href={`/shop/${product.id}`}
          className="block group-hover:underline decoration-slate-400"
        >
          <h3 className="text-slate-800 text-sm font-normal  leading-tight  line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Dynamic Pricing Row */}
        <div className="flex items-center justify-between flex-wrap gap-x-2 mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">
              <span className="text-[13px]">₦</span>
              {Number(product.offer_price || product.price).toLocaleString()}
            </span>
            {product.offer_price && (
              <span className="text-xs text-slate-400 line-through">
                ₦{Number(product.price).toLocaleString()}
              </span>
            )}

            {/* Sales Indicator Badge */}
            {/* <span className="text-[11px] font-medium text-slate-500 flex items-center gap-0.5 ml-1">
              <Flame size={12} className="text-orange-500 fill-orange-500" />
              {salesCount} sold
            </span> */}
          </div>

          {/* Quick Add To Cart Button */}
          <button
            type="button"
            className="w-8 h-7 cursor-pointer border border-slate-500 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-50 hover:border-slate-900 active:scale-95 transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Tag Meta Row */}
        {/* <div className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1 flex-wrap">
          <span className="font-semibold">Best-Selling Item</span>
          <span className="text-slate-400 font-normal">
            in {product.category || "Components"}
          </span>
        </div> */}

        {/* Star Rating Layout Row */}
        {/* <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-slate-900">
            {Array.from({ length: ratingStars }).map((_, i) => (
              <Star key={i} size={11} className="fill-slate-900" />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {Number(reviewCount).toLocaleString()}
          </span>
        </div> */}
      </div>
    </div>
  );
}
