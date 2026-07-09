"use client";

import { useState } from "react";
import { Edit3, Package, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default function AdminProductList({ products }: { products: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Instant filtering logic
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Inventory Manager
          </h1>

          {/* Sticky Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* --- 1. MOBILE RESPONSIVE CARD VIEW --- */}
        <div className="space-y-4 md:hidden">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Package className="m-auto text-slate-300" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                    ID: {product.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 max-w-[100px]"
                >
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs font-bold"
                  >
                    <Edit3 size={14} className="mr-1" /> Edit
                  </Button>
                </Link>
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                  images={product.images || []}
                />
              </div>
            </div>
          ))}
        </div>

        {/* --- 2. DESKTOP WORKSPACE VIEW --- */}
        <div className="hidden md:block bg-white w-full border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-5">Product</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Pricing</th>
                <th className="px-6 py-5 text-center">In Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package
                            className="m-auto text-slate-300"
                            size={24}
                          />
                        )}
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-2">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold capitalize">
                      {product.category || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black">
                    ₦{(product.offer_price || product.price)?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center font-black">
                    {product.stock_quantity}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-slate-400 hover:text-emerald-600"
                        >
                          <Edit3 size={18} />
                        </Button>
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                        images={product.images || []}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-20 text-center bg-white border border-slate-200 rounded-xl">
            <h2 className="text-emerald-900 font-bold text-lg">
              No products found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
