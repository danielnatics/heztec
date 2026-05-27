import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "HezTec",
  description:
    "Bringing ideas to life, HezTec is a comprehensive electronics design and manufacturing startup specialized in turnkey product development and supply of high-quality electronic components. We provide end-to-end hardware development from custom PCB design and embedded systems programming for IoT and automation to 3D printed enclosures delivering complete functional devices. Our core expertise includes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
