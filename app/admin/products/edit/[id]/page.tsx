"use client";

import { useEffect, useState, use, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Plus,
  Settings2,
  X,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Track featured check status independently
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Dynamic specs sentence string tracking array
  const [specs, setSpecs] = useState<string[]>([""]);

  // Track raw filesystem files and their short-term local blobs
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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
          category: data.category || "Microcontrollers",
          description: data.description || "",
          images: data.images || [],
        });
        setIsFeatured(data.is_featured || false);
        setSpecs(data.specs && data.specs.length > 0 ? data.specs : [""]);
      }
      setLoading(false);
    }
    loadProduct();
  }, [resolvedParams.id, supabase]);

  // --- Dynamic Specs Control Handlers ---
  const addSpecField = () => setSpecs([...specs, ""]);
  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };
  const updateSpec = (index: number, val: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index] = val;
    setSpecs(updatedSpecs);
  };

  // --- Image Upload and Selection Pipeline Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrentImages = formData.images.length + newFiles.length;

    if (totalCurrentImages + files.length > 3) {
      toast.warning("You can only have a maximum of 3 images total for this product.");
      return;
    }

    const updatedFiles = [...newFiles, ...files];
    const updatedPreviews = files.map((file) => URL.createObjectURL(file));

    setNewFiles(updatedFiles);
    setNewPreviews([...newPreviews, ...updatedPreviews]);
  };

  const removeExistingImage = (indexToRemove: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== indexToRemove);
    setFormData({ ...formData, images: updatedImages });
  };

  const removeNewImage = (indexToRemove: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== indexToRemove));
    setNewPreviews(newPreviews.filter((_, i) => i !== indexToRemove));
  };

  // --- Core Submit Put Save Pipeline ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const uploadedUrls: string[] = [...formData.images];

      // Process new raw staging images to storage buckets
      for (const file of newFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: formData.price,
          stock_quantity: formData.stock_quantity,
          offer_price: formData.offer_price || null,
          category: formData.category,
          description: formData.description,
          images: uploadedUrls,
          is_featured: isFeatured,
          specs: specs.filter((s) => s.trim() !== ""),
        })
        .eq("id", resolvedParams.id);

      if (error) throw error;

      toast.success("HezTec Ecosystem Component Updated!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error("Update Failure: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );

  const totalImageCount = formData.images.length + newFiles.length;

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
            {/* Left: General Info & Specifications Layout */}
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
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* TECHNICAL SPECIFICATIONS ARRAY FIELD */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-900 uppercase">
                  <Settings2 size={16} className="text-emerald-600" /> Technical Specifications
                </div>
                
                <div className="space-y-3 pt-2">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        placeholder="Specification sentence (e.g. Operating Voltage 5V)"
                        value={spec}
                        onChange={(e) => updateSpec(index, e.target.value)}
                        className="bg-slate-50 border-slate-200 text-sm h-11 rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecField(index)}
                        className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSpecField}
                    className="w-full border-dashed border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold text-xs h-11 rounded-xl mt-2"
                  >
                    <Plus size={14} className="mr-2" /> ADD SPECIFICATION SENTENCE
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Pricing, Meta & Image Assets Manager */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Base Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-black focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Offer Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.offer_price || ""}
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
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.stock_quantity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: Number(e.target.value),
                      })
                    }
                    required
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

                {/* FEATURED PRODUCT TOGGLE FIELD CHIP */}
                <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer flex-shrink-0"
                  />
                  <div className="flex flex-col select-none">
                    <Label htmlFor="is_featured" className="text-[10px] font-black uppercase text-emerald-900 cursor-pointer">
                      Feature Product
                    </Label>
                    <span className="text-[9px] font-medium text-emerald-600/60 uppercase">
                      Show on Marketplace Landing
                    </span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC HYBRID IMAGE GALLERY ASSETS MANAGER */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">
                  Gallery Assets ({totalImageCount} / 3)
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Map existing image URLs on backend */}
                  {formData.images.map((url, i) => (
                    <div
                      key={`existing-${i}`}
                      className="group relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200"
                    >
                      <img
                        src={url}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Map local image file blobs waiting to be pushed */}
                  {newPreviews.map((src, i) => (
                    <div
                      key={`new-${i}`}
                      className="group relative aspect-square rounded-xl bg-slate-50 overflow-hidden border border-dashed border-emerald-300"
                    >
                      <img
                        src={src}
                        alt="Staged Upload preview"
                        className="object-cover w-full h-full opacity-80"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[7px] font-black uppercase rounded">
                        New Staged
                      </span>
                    </div>
                  ))}

                  {/* Dynamic Active Upload Trigger Box Component */}
                  {totalImageCount < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-300 transition-all bg-slate-50/50"
                    >
                      <Upload size={20} />
                      <span className="text-[9px] font-black uppercase mt-1">
                        Add Image
                      </span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />

                <p className="mt-4 text-[10px] text-slate-400 leading-tight">
                  * The first element serves as the primary storefront image card cover design asset. Max 3 images total.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}