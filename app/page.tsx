// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

//     </div>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Settings, 
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-emerald-950">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                HezTec Engineering Lab Active
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter">
              The Hub for <span className="text-emerald-400">Advanced</span> Electronics.
            </h1>
            
            <p className="text-emerald-100/70 text-lg md:text-xl max-w-lg leading-relaxed">
              Specializing in embedded systems, custom PCB design, and high-performance LiFePO4 power solutions for Nigerian innovation.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/marketplace" className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl transition-all flex items-center gap-2">
                Shop Components <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl backdrop-blur-md border border-white/10 transition-all">
                Our Services
              </Link>
            </div>
          </div>

          {/* Hero Visual (Your Startup Product Focus) */}
          <div className="hidden lg:block relative aspect-square">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
            {/* Replace with an image of your PCB or Battery Pack */}
            <div className="relative z-10 w-full h-full border border-emerald-500/20 rounded-3xl overflow-hidden bg-emerald-900/50 backdrop-blur-sm p-8">
               <div className="w-full h-full rounded-2xl border border-dashed border-emerald-500/30 flex items-center justify-center text-emerald-500/50 italic text-sm">
                 [Featured HezTec Hardware Preview]
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS (Your Expertise) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Technical Excellence.</h2>
            <p className="text-slate-500 text-lg">We bridge the gap between complex hardware engineering and practical, local implementation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: "Hardware Retail", 
                icon: <Cpu className="w-7 h-7" />, 
                desc: "Sourcing verified ESP32, Arduino, and sensor modules for engineering projects.",
                link: "/marketplace"
              },
              { 
                title: "Custom Prototyping", 
                icon: <Settings className="w-7 h-7" />, 
                desc: "Turnkey PCB design and 3D-printed enclosure integration for your startups.",
                link: "/services"
              },
              { 
                title: "Power Engineering", 
                icon: <Zap className="w-7 h-7" />, 
                desc: "Specialized in 72V LiFePO4 battery packs with custom BMS for electric mobility.",
                link: "/services"
              }
            ].map((pillar, i) => (
              <div key={i} className="group p-10 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{pillar.desc}</p>
                <Link href={pillar.link} className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 uppercase tracking-widest hover:gap-3 transition-all">
                  Learn More <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST SECTION (The Lab Standard) --- */}
      <section className="py-24 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-2xl bg-emerald-50 mt-12" />
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Tested in the HezTec Lab. Built for Nigeria.</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Every component in our marketplace undergoes rigorous diagnostic testing. We don't just sell hardware; we provide the same tools we use for our own industrial training and startup developments.
            </p>
            
            <ul className="space-y-4">
              {[
                "Verified authentic microcontrollers",
                "Advanced 72V Battery System diagnostics",
                "Technical support from embedded engineers"
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-800">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-emerald-700" />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-emerald-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -mr-48 -mt-48" />
             <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to build your next project?</h2>
                <p className="text-emerald-100/60 text-lg max-w-xl mx-auto">
                  Join the engineers and students using HezTec for professional-grade hardware and power systems.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/marketplace" className="px-10 py-5 bg-white text-emerald-950 font-black rounded-2xl hover:bg-emerald-50 transition-all">
                    Visit Marketplace
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">H</span>
            </div>
            <span className="font-black text-slate-900 tracking-tight">HezTec Innovation</span>
          </div>
          
          <div className="text-sm text-slate-400 font-medium">
            © 2026 HezTec Nigeria. Engineered by Daniel.
          </div>
        </div>
      </footer>
    </div>
  );
}