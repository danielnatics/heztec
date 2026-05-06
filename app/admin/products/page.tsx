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
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Inventory Manager
            </h1>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Pricing</th>
                  <th className="px-6 py-5 text-center">In Stock</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
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
                            <Package
                              className="m-auto text-slate-300"
                              size={24}
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {product.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600  text-xs font-bold capitalize">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">
                          ₦
                          {product.offer_price?.toLocaleString() ||
                            product.price?.toLocaleString()}
                        </span>
                        {product.offer_price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₦{product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Placeholder */}
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[15px] font-black uppercase">
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
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </Button> */}
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
      </div>
    </div>
  );
}
