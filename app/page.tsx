import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Zap,
  ShieldCheck,
  Printer,
  Package,
  Mail,
  MapPin,
  ArrowUpRight,
  PhoneCall,
} from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "PCB Design & Prototyping",
      icon: <Cpu className="w-5 h-5" />,
      desc: "Custom PCB layout, schematic capture, and fast-turn prototyping — from concept to manufactured board.",
      link: "/services",
      number: "01",
    },
    {
      title: "Embedded Systems & IoT",
      icon: <Zap className="w-5 h-5" />,
      desc: "Firmware development, ESP32/STM32 integration, and end-to-end IoT deployment for any application.",
      link: "/services",
      number: "02",
    },
    {
      title: "3D Printing",
      icon: <Printer className="w-5 h-5" />,
      desc: "Rapid enclosure fabrication, mechanical prototyping, and custom hardware housings printed to spec.",
      link: "/services",
      number: "03",
    },
    {
      title: "Electronic Component Sales",
      icon: <Package className="w-5 h-5" />,
      desc: "Microcontrollers, sensors, modules, and passive components — sourced and ready to ship.",
      link: "/shop",
      number: "04",
    },
  ];

  const stats = [
    { value: "10+", label: "Projects Delivered" },
    { value: "3+", label: "Years Experience" },
    { value: "4", label: "Core Services" },
    { value: "24hr", label: "Support Response" },
  ];

  const whyPoints = [
    "ESP32 / STM32 firmware and hardware integration",
    "Fast-turn PCB design from schematic to board",
    "Dedicated engineering support from concept to deployment",
  ];

  const projects = [
    // {
    //   tag: "EV · Power Systems",
    //   title: "72V LiFePO4 Swappable Battery Pack",
    //   desc: "Full BMS integration, cell balancing, and swappable architecture for electric mobility applications.",
    //   number: "01",
    // },
    {
      tag: "IoT · Solar",
      title: "IoT-Enabled Solar Food Dryer",
      desc: "Remote monitoring and control for agricultural solar drying, deployed with ESP32 and cloud dashboard.",
      number: "02",
    },
    {
      tag: "Embedded · RFID",
      title: "Offline RFID POS System",
      desc: "Cashless payment infrastructure for schools — works fully offline with local data sync.",
      number: "03",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-600" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-[2px] bg-green-600" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Hardware Engineering Studio
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight max-w-3xl">
            Where Ideas<br />
            Become <span className="text-green-600">Hardware.</span>
          </h1>

          <p className="mt-7 text-base text-slate-500 leading-relaxed max-w-md">
            HezTec delivers embedded systems, custom PCB design, 3D printing,
            and electronic components — engineered for the next generation of builders.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white rounded-lg transition-all"
              style={{ background: "#16a34a" }}
            >
              Explore Services
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-slate-700 rounded-lg border border-slate-200 hover:border-slate-400 transition-all bg-white"
            >
              Shop Components
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold text-green-600">{s.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">
                What We Do
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                End-to-End Engineering Services
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed md:max-w-xs">
              From schematic to shipped product — full-stack hardware engineering under one roof.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((s, i) => (
              <Link
                key={i}
                href={s.link}
                className="group flex items-start md:items-center gap-6 md:gap-10 py-7 hover:bg-slate-50 px-4 -mx-4 rounded-xl transition-all duration-200"
              >
                <span className="text-xs font-semibold text-slate-300 tracking-widest w-6 flex-shrink-0 mt-1 md:mt-0">
                  {s.number}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4", color: "#16a34a" }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-green-300 group-hover:text-green-600 group-hover:bg-green-50 transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HEZTEC ─────────────────────────────────────────── */}
      <section className="py-24 border-b border-slate-100" style={{ background: "#fafafa" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">
              Why HezTec
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">
              Built for Builders
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              HezTec was founded to close the gap between hardware ideas and execution.
              Whether you need a custom embedded system, a PCB designed from scratch, or
              components for your next build — we're the engineering partner that understands your context.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-green-700 transition-colors group"
            >
              About HezTec
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ul className="space-y-4 lg:pt-12">
            {whyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: "#dcfce7" }}
                >
                  <ShieldCheck size={11} style={{ color: "#16a34a" }} />
                </div>
                <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ──────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">
                Featured Work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Engineering in Action
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-700 transition-colors group self-start md:self-end"
            >
              View all projects
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <div
                key={i}
                className="rounded-xl p-7 border border-slate-100 hover:border-green-100 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {p.tag}
                  </span>
                  <span className="text-2xl font-bold text-slate-100">{p.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl px-10 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
            style={{ background: "#0f172a" }}
          >
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-400 mb-4">
                Get Started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug mb-4">
                Ready to build your next project?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                From a single component to a complete embedded system — get in touch with the HezTec team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white rounded-lg transition-all"
                style={{ background: "#16a34a" }}
              >
                Start a Project
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-slate-300 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                Browse Components
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">

          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="HezTec" className="w-8 h-8 object-contain" />
              <div>
                <p className="font-bold text-slate-900">HezTec</p>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-green-600">Engineered Excellence</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              A hardware engineering startup delivering embedded systems, PCB design,
              3D printing, and electronic components worldwide.
            </p>
            <div className="space-y-2 pt-1">
              <a href="mailto:getheztec@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-600 transition-colors">
                <Mail size={13} /> getheztec@gmail.com
              </a>
              <a href="tel:+2348130123588" className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-600 transition-colors">
                <PhoneCall size={13} /> +2348130123588
              </a>
              {/* <span className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={13} /> Available Worldwide
              </span> */}
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          <div className="md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300 mb-4">Company</p>
            <ul className="space-y-2.5">
              {["About", "Services", "Shop", "Blog", "Contact"].map((l) => (
                <li key={l}>
                  <Link href={`/${l.toLowerCase()}`} className="text-sm text-slate-600 hover:text-green-700 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300 mb-4">Services</p>
            <ul className="space-y-2.5">
              {["PCB Design", "Embedded Systems", "IoT Development", "3D Printing", "Component Sales"].map((l) => (
                <li key={l}>
                  <Link href="/services" className="text-sm text-slate-600 hover:text-green-700 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 lg:px-12 py-5">
          <p className="text-xs text-slate-400 text-center">© 2026 HezTec Innovation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}