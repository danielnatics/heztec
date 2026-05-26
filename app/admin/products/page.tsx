import { createClient } from "@/lib/supabase/server";
import { Edit3, Plus, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductList() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Inventory Manager
          </h1>
        </div>

        {/* --- 1. MOBILE RESPONSIVE CARD VIEW (Visible on screens smaller than md) --- */}
        <div className="space-y-4 md:hidden">
          {products?.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4"
            >
              {/* Product Info Banner */}
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
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-slate-900 line-clamp-2">
                    {product.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                    ID: {product.id.substring(0, 8)}
                  </span>
                </div>
              </div>

              {/* Specs & Status Metrics Wrapper */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center items-center">
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-full mt-0.5">
                    {product.category || "General"}
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stock</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5">
                    {product.stock_quantity}
                  </span>
                </div>

                <div className="flex flex-col items-end text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5">
                    ₦{(product.offer_price || product.price)?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Operational Control Toggles */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Link href={`/admin/products/edit/${product.id}`} className="flex-1 max-w-[100px]">
                  <Button
                    variant="outline"
                    className="w-full h-9 text-slate-600 border-slate-200 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <Edit3 size={14} /> Edit
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

        {/* --- 2. DESKTOP WORKSPACE VIEW (Hidden on mobile, snaps open on md screens) --- */}
        <div className="hidden md:block bg-white w-full border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
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
                {products?.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    {/* Info & Image */}
                    <td className="px-8 py-5">
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
                        <div className="flex flex-col">
                          <span className="font-bold line-clamp-2 text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                            {product.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold capitalize">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">
                          ₦
                          {(product.offer_price || product.price)?.toLocaleString()}
                        </span>
                        {product.offer_price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₦{product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-black text-slate-800 bg-slate-50 border border-slate-100 rounded-lg">
                        {product.stock_quantity}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
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
        </div>

        {/* Empty Inventory State */}
        {(!products || products.length === 0) && (
          <div className="p-20 text-center bg-white border border-slate-200 rounded-xl">
            <h2 className="text-emerald-900 font-bold text-lg">Warehouse Empty</h2>
            <p className="text-sm text-slate-500 mt-1">The database returned 0 items.</p>
          </div>
        )}

      </div>
    </div>
  );
}