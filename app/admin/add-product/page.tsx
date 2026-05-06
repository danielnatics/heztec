"use client";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddProduct() {
  return (
    <div className="space-y-8">
      {/* Product Image Section */}
      <section className="space-y-4">
        <label className="text-sm font-semibold text-slate-700">Product Images</label>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square border-2 border-dashed border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50/50 cursor-pointer transition-colors group">
              <Upload className="text-emerald-300 group-hover:text-emerald-500" size={24} />
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Upload</span>
            </div>
          ))}
        </div>
      </section>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Product Name</label>
          <Input placeholder="Type here..." className="border-emerald-100 focus-visible:ring-emerald-500" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Product Description</label>
          <Textarea placeholder="Type here..." className="min-h-[120px] border-emerald-100 focus-visible:ring-emerald-500" />
        </div>
      </div>

      {/* Pricing & Category */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Category</label>
          <select className="w-full h-10 px-3 rounded-md border border-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Microcontrollers</option>
            <option>Sensors</option>
            <option>Power/BMS</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Product Price (₦)</label>
          <Input type="number" placeholder="0" className="border-emerald-100" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Offer Price (₦)</label>
          <Input type="number" placeholder="0" className="border-emerald-100" />
        </div>
      </div>

      <Button className="w-full sm:w-40 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl">
        ADD PRODUCT
      </Button>
    </div>
  );
}