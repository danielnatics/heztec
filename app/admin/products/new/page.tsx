"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Upload, X, PackagePlus, Info, Tag, 
  Coins, Hash, Plus, Settings2, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddProduct() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // UPDATED: State is now just an array of sentences (strings)
  const [specs, setSpecs] = useState<string[]>([""]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkUser();
  }, [router, supabase]);

  // --- Simplified Specs Logic ---
  const addSpecField = () => setSpecs([...specs, ""]);
  
  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, val: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index] = val;
    setSpecs(updatedSpecs);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast.warning("You can only upload a maximum of 3 images.");
      return;
    }
    const newImages = [...images, ...files];
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages(newImages);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const uploadedUrls: string[] = [];

      for (const file of images) {
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

      const { error: dbError } = await supabase.from("products").insert([
        {
          name: formData.get("name"),
          price: formData.get("price"),
          offer_price: formData.get("offer_price") || null,
          stock_quantity: formData.get("stock"),
          category: formData.get("category"),
          description: formData.get("description"),
          images: uploadedUrls,
          is_featured: isFeatured,
          // UPDATED: Filter out empty lines and save as an array
          specs: specs.filter(s => s.trim() !== ""), 
        },
      ]);

      if (dbError) throw dbError;
      
      toast.success("HezTec Inventory Updated Successfully!");
      setImages([]);
      setPreviews([]);
      setSpecs([""]);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-emerald-950 uppercase">
            HezTec Admin Panel
          </h1>
          <p className="text-emerald-600/70 font-medium">
            Deploy new components to the HezTec ecosystem.
          </p>
        </div>
        <PackagePlus size={40} className="text-emerald-100 hidden sm:block" />
      </div>

      <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-emerald-100/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest text-emerald-900">
                <Info size={16} className="text-emerald-600" /> GENERAL DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold text-xs">COMPONENT NAME</Label>
                <Input id="name" name="name" required className="border-emerald-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold text-xs">TECHNICAL DESCRIPTION</Label>
                <Textarea id="description" name="description" className="min-h-[120px] border-emerald-100" />
              </div>
            </CardContent>
          </Card>

          {/* UPDATED: DYNAMIC SPECS SECTION (Sentence List) */}
          <Card className="border-emerald-100/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-900">
              <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest text-emerald-400">
                <Settings2 size={16} /> TECHNICAL SPECIFICATIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-center group">
                    <Input 
                      placeholder="Enter a specification sentence (e.g. Operating Voltage 5V)" 
                      value={spec}
                      onChange={(e) => updateSpec(index, e.target.value)}
                      className="bg-slate-50 border-slate-200 text-sm"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSpecField(index)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSpecField}
                  className="w-full border-dashed border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold text-xs"
                >
                  <Plus size={14} className="mr-2" /> ADD SPECIFICATION SENTENCE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100/50 shadow-sm">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest text-emerald-900">
                <Upload size={16} className="text-emerald-600" /> COMPONENT VISUALS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-100">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 text-emerald-400">
                    <Upload size={20} />
                    <span className="text-[10px] font-bold uppercase">Upload</span>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" multiple />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-100/50 shadow-sm">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest text-emerald-900">
                <Tag size={16} className="text-emerald-600" /> CATEGORIZATION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">CATEGORY</Label>
                <select name="category" className="w-full h-10 px-3 rounded-md border border-emerald-100 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="microcontroller">Microcontrollers</option>
                  <option value="sensor">Sensors</option>
                  <option value="power">Power & BMS</option>
                  <option value="display">Display</option>
                  <option value="pcb">Custom PCB</option>
                  <option value="module">Modules</option>
                  <option value="motor">Motor and Motor Drivers</option>
                  <option value="relay">Relay and Switches</option>
                  <option value="ic">IC's</option>
                  <option value="printer">Printer</option>
                  <option value="wireless">Wireless communication</option>
                  <option value="kit">Kit</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">STOCK QUANTITY</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300" size={14} />
                  <Input name="stock" type="number" className="pl-9" required />
                </div>
              </div>
            </CardContent>
          </Card>
                <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-4">
  <input 
    type="checkbox" 
    id="is_featured" 
    checked={isFeatured}
    onChange={(e) => setIsFeatured(e.target.checked)}
    className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer"
  />
  <div className="flex flex-col">
    <Label htmlFor="is_featured" className="text-[10px] font-black uppercase text-emerald-900 cursor-pointer">
      Feature Product
    </Label>
    <span className="text-[9px] font-medium text-emerald-600/60 uppercase">
      Show on Marketplace Landing Page
    </span>
  </div>
</div>
          <Card className="border-emerald-100/50 shadow-sm border-2">
            <CardHeader className="bg-emerald-50/30">
              <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest text-emerald-900">
                <Coins size={16} className="text-emerald-600" /> PRICING (₦)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs">BASE PRICE</Label>
                  <Input name="price" type="number" required />
                </div>
                <div className="space-y-2 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                  <Label className="text-emerald-800 font-bold text-xs tracking-tight">SPECIAL OFFER PRICE</Label>
                  <Input name="offer_price" type="number" className="bg-white mt-1" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl transition-all shadow-lg shadow-emerald-200">
                {loading ? "PROCESSING HARDWARE..." : "PUBLISH TO MARKETPLACE"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}