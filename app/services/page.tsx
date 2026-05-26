import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Zap,
  Printer,
  Package,
  Building2,
  ChevronRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function ServicesPage() {
  const mainServices = [
    {
      id: "pcb",
      number: "01",
      icon: <Cpu className="w-6 h-6" />,
      title: "PCB Design & Fabrication",
      tagline: "From schematic to manufactured board.",
      desc: "We handle the full PCB development cycle — schematic capture, layout, design rule checks, Gerber generation, and fabrication coordination. Whether you need a simple single-layer board or a complex multilayer design, we deliver production-ready files.",
      deliverables: [
        "Schematic design & review",
        "Single to multilayer PCB layout",
        "Design Rule Check (DRC) & ERC",
        "Gerber files & BOM generation",
        "Prototype & small-batch fabrication",
        "KiCad / EasyEDA design support",
      ],
    },
    {
      id: "embedded",
      number: "02",
      icon: <Zap className="w-6 h-6" />,
      title: "Embedded Systems Development",
      tagline: "Firmware that drives your hardware.",
      desc: "We develop reliable firmware and embedded software for microcontroller-based systems. From bare-metal C/C++ on STM32 to Arduino and ESP32 IoT projects, we build systems that work in real-world conditions.",
      deliverables: [
        "Bare-metal firmware (C/C++)",
        "ESP32 / Arduino / STM32 development",
        "RTOS integration",
        "UART, SPI, I2C, CAN communication",
        "Sensor integration & data acquisition",
        "OTA firmware update support",
      ],
    },
    {
      id: "iot",
      number: "03",
      icon: <Zap className="w-6 h-6" />,
      title: "IoT Systems & Connectivity",
      tagline: "Connect your hardware to the cloud.",
      desc: "We design and deploy end-to-end IoT solutions — from edge devices to cloud dashboards. Whether it's remote monitoring, smart automation, or data logging, we build the full stack: hardware, firmware, and web interface.",
      deliverables: [
        "MQTT / HTTP cloud integration",
        "Remote monitoring dashboards",
        "WiFi, BLE, LoRa connectivity",
        "Data logging & alerting",
        "Mobile-friendly web dashboards",
        "Solar-powered IoT deployments",
      ],
    },
    {
      id: "printing",
      number: "04",
      icon: <Printer className="w-6 h-6" />,
      title: "3D Design & Printing",
      tagline: "Enclosures, brackets, and mechanical parts.",
      desc: "We design and print custom enclosures, mechanical fixtures, and prototyping parts. Perfect for housing your electronics, creating product prototypes, or fabricating one-off mechanical components quickly and cost-effectively.",
      deliverables: [
        "Custom enclosure design (CAD)",
        "FDM 3D printing (PLA, PETG, ABS)",
        "PCB mounting brackets & housings",
        "Rapid prototyping parts",
        "Product mockups & visual prototypes",
        "Design-for-manufacture guidance",
      ],
    },
    {
      id: "components",
      number: "05",
      icon: <Package className="w-6 h-6" />,
      title: "Electronic Component Sales",
      tagline: "The parts you need, when you need them.",
      desc: "We stock and supply microcontrollers, sensors, modules, passive components, development boards, and power components. Order individual parts or in bulk — we'll get them to you fast.",
      deliverables: [
        "ESP32, Arduino, STM32 boards",
        "Sensors: temperature, motion, gas, light",
        "OLED, LCD, TFT displays",
        "LiFePO4 cells & BMS modules",
        "Resistors, capacitors, ICs",
        "Bulk order discounts available",
      ],
    },
  ];

  const businessService = {
    title: "Business Systems Development",
    tagline: "Custom hardware and software systems for your operations.",
    desc: "Beyond standard services, HezTec designs and builds complete operational systems for businesses — combining embedded hardware, IoT connectivity, and software to automate, monitor, or improve how your business runs.",
    examples: [
      {
        title: "Access Control Systems",
        desc: "RFID or fingerprint-based door access, attendance tracking, and staff management.",
      },
      {
        title: "Industrial Monitoring",
        desc: "Real-time monitoring of machines, temperature, power, or environmental conditions.",
      },
      {
        title: "POS & Payment Systems",
        desc: "Custom offline/online point-of-sale systems for retail, schools, or events.",
      },
      {
        title: "Smart Energy Solutions",
        desc: "Solar charge controllers, battery management, and energy monitoring systems.",
      },
      {
        title: "Inventory & Asset Tracking",
        desc: "RFID or barcode-based tracking systems for warehouses and logistics.",
      },
      {
        title: "Custom Automation",
        desc: "Bespoke automation solutions tailored to your specific operational workflow.",
      },
    ],
  };

  const process = [
    { step: "01", title: "Brief", desc: "Tell us what you need. We'll ask the right questions to understand your goals, constraints, and timeline." },
    { step: "02", title: "Proposal", desc: "We send a detailed scope, timeline, and quote. No vague estimates — just clear deliverables." },
    { step: "03", title: "Build", desc: "We design, develop, and test your system. You get progress updates throughout." },
    { step: "04", title: "Deliver", desc: "We hand over all files, firmware, and documentation. Support included after delivery." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── GREEN TOP BAR ── */}
      <div className="h-1 w-full bg-green-600" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-6 h-[2px] bg-green-600" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              What We Offer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-2xl">
            Services Built for<br />
            <span className="text-green-600">Hardware Builders.</span>
          </h1>
          <p className="mt-6 text-base text-slate-500 leading-relaxed max-w-lg">
            From a single PCB to a complete business automation system — HezTec covers the full spectrum of hardware engineering services.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
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
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-slate-700 rounded-lg border border-slate-200 hover:border-slate-400 transition-all"
            >
              Browse Components
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN SERVICES ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">Core Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">What We Do</h2>
          </div>

          <div className="space-y-6">
            {mainServices.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="rounded-xl border border-slate-100 overflow-hidden hover:border-green-100 hover:shadow-md transition-all duration-200"
              >
                {/* Service header */}
                <div className="flex items-start gap-5 p-7 bg-white">
                  <span className="text-xs font-semibold text-slate-300 tracking-widest mt-1 w-6 flex-shrink-0">
                    {s.number}
                  </span>
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                        <p className="text-sm font-semibold text-green-600 mb-3">{s.tagline}</p>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{s.desc}</p>
                      </div>
                      <Link
                        href="/contact"
                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 transition-colors whitespace-nowrap"
                      >
                        Get a quote <ChevronRight size={13} />
                      </Link>
                    </div>

                    {/* Deliverables */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {s.deliverables.map((d, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 leading-relaxed">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS SYSTEMS ──────────────────────────────────── */}
      <section className="py-20 border-t border-slate-100" style={{ background: "#fafafa" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">For Businesses</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight max-w-xl">
                {businessService.title}
              </h2>
              <p className="mt-3 text-sm font-semibold text-green-600">{businessService.tagline}</p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white rounded-lg transition-all self-start lg:self-end"
              style={{ background: "#16a34a" }}
            >
              Discuss Your Project <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mb-12">
            {businessService.desc}
          </p>

          {/* Example systems grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {businessService.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-100 p-6 hover:border-green-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ background: "#16a34a" }}
                  />
                  <h4 className="font-semibold text-slate-900 text-sm">{ex.title}</h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-5">{ex.desc}</p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 p-5 rounded-xl border border-green-100 bg-green-50 flex items-start gap-3">
            <Building2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 leading-relaxed">
              <strong>Don't see your use case?</strong> Every business has unique needs. If you have a problem that hardware can solve, we'd like to hear about it. We'll assess the feasibility and propose a solution tailored to your operation.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-600 mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Our Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-[1px] bg-slate-100 z-0" style={{ width: "calc(100% - 24px)", left: "calc(50% + 12px)" }} />
                )}
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-sm font-bold"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    {p.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl px-10 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
            style={{ background: "#0f172a" }}
          >
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-green-400 mb-4">
                Ready to Start?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug mb-4">
                Let's build something together.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Describe your project and we'll get back to you with a clear plan and quote within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white rounded-lg transition-all"
                style={{ background: "#16a34a" }}
              >
                Contact Us
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:getheztec@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-slate-300 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                <Mail size={14} /> Email Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}