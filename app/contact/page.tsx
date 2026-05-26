"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Loader2, 
  ArrowLeft,
  User,
  Layers,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState("marketplace");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Save contact submission directly to your Supabase database 
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          purpose: projectType,
          message: formData.get("message"),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Message received! The HezTec Lab team will review this and reply within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error("Submission failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Navigation Bar */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT COLUMN: DIRECT LAB CHANNELS & IDENTITY --- */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-green-600 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-green-600 inline-block" /> Connect with Labs
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Let's Build <br />
                <span className="text-green-600">Together.</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
                Have an engineering problem, custom battery pack request, or a marketplace order inquiry? Drop our core engineers a line.
              </p>
            </div>

            {/* Official Interactive Channels Info Array */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Direct Channels</h2>
              
              <a 
                href="https://wa.me/2348130123588" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp Lab Direct</span>
                  <span className="text-sm font-bold text-slate-900 truncate">08130123588</span>
                </div>
              </a>

              <a 
                href="mailto:getheztec@gmail.com" 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50/50 border border-transparent hover:border-green-100 transition-all group"
              >
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Official Email</span>
                  <span className="text-sm font-bold text-slate-900 truncate">getheztec@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DYNAMIC SYSTEM FORM SUBMISSION --- */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Purpose Category Selection Toggles */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Inquiry Scope</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "marketplace", label: "Shop Order" },
                    { id: "custom_hardware", label: "PCB / Custom Build" },
                    { id: "business_iot", label: "Business System" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all text-center px-2 cursor-pointer ${
                        projectType === type.id
                          ? "bg-green-950 text-white border-green-950 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details Layout Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input id="name" name="name" required placeholder="Daniel" className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input id="phone" name="phone" required type="tel" placeholder="08130123588" className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input id="email" name="email" required type="email" placeholder="example@domain.com" className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600" />
                </div>
              </div>

              {/* Text Message Field Area */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-wider text-slate-400">Project Brief / Message</Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-4 text-slate-300" size={16} />
                  <Textarea id="message" name="message" required rows={5} placeholder="Provide details here (e.g., 72V battery specs, code issue, order tracker ID, etc.)" className="pl-10 pt-3 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-green-600 leading-relaxed" />
                </div>
              </div>

              {/* Submit CTA Handle */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 group text-sm cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>TRANSMITTING DATA PORT...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </Button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}