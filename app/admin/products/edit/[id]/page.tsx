"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    offer_price: 0,
    stock_quantity: 0,
    category: "",
    description: "",
    images: [] as string[],
  });

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (data) {
        setFormData({
          name: data.name,
          price: data.price,
          stock_quantity: data.stock_quantity,
          offer_price: data.offer_price || 0,
          category: data.category || "",
          description: data.description || "",
          images: data.images || [],
        });
      }
      setLoading(false);
    }
    loadProduct();
  }, [resolvedParams.id, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
        offer_price: formData.offer_price || null,
        category: formData.category,
        description: formData.description,
        images: formData.images,
      })
      .eq("id", resolvedParams.id);

    if (!error) {
      router.push("/admin/products");
      router.refresh();
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-emerald-700 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Inventory
        </Link>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Edit Component
            </h1>
            <Button
              disabled={saving}
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 rounded-xl h-12 font-bold"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: General Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Technical Description
                  </label>
                  <textarea
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Right: Pricing & Meta */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Base Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-black focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Offer Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.offer_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offer_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    stock quantity
                  </label>
                  <input
                    type="number"
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Category
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-sm outline-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Microcontrollers">Microcontrollers</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Power Systems">Power Systems</option>
                    <option value="Displays">Displays</option>
                  </select>
                </div>
              </div>

              {/* Image Manager Preview */}
              {/* Image Manager Preview */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">
                  Gallery Assets ({formData.images.length})
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((url, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200"
                    >
                      <img
                        src={url}
                        alt=""
                        className="object-cover w-full h-full"
                      />

                      {/* DELETE BUTTON: Appears on Hover */}
                      <button
                        type="button"
                        onClick={() => {
                          // Filter out the image at this specific index
                          const updatedImages = formData.images.filter(
                            (_, index) => index !== i,
                          );
                          setFormData({ ...formData, images: updatedImages });
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        title="Remove Image"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Badge to show which image is the Main/Cover */}
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Add Image Placeholder */}
                  <button
                    type="button"
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-300 transition-all"
                  >
                    <ImageIcon size={24} />
                    <span className="text-[9px] font-black uppercase mt-1">
                      Add Image
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-[10px] text-slate-400 leading-tight">
                  * The first image in the list will be used as the primary
                  display in the Marketplace.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
