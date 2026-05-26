"use client";

import Link from "next/link";
import { ShieldAlert, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md border border-slate-200 shadow-xl shadow-slate-200/30 rounded-3xl p-8 text-center space-y-6">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-sm animate-pulse">
          <ShieldAlert size={28} />
        </div>

        {/* Text Headers */}
        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            Authentication Link Expired
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            The verification token or secure session window has closed out. This happens if the link was already clicked once or took too long to open.
          </p>
        </div>

        {/* Informational Hint Card */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs font-medium text-slate-600 space-y-1.5">
          <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">What can you do?</span>
          <p>• Try accessing the sign-in screen directly.</p>
          <p>• Request a new confirmation email from the registry window.</p>
        </div>

        {/* Operational Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/login" className="flex-1">
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-12 rounded-xl transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2 group text-xs"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>RETRY SIGN IN</span>
            </Button>
          </Link>
          
          <Link href="/" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span>RETURN HOME</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}