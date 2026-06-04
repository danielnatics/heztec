"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // This tells Supabase where to send the user AFTER they click the email link
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Recovery link sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4 font-sans">
      <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="space-y-3 pb-4 text-center border-b border-slate-50 bg-slate-50/30 pt-8">
          <CardTitle className="text-xl font-black text-slate-900 tracking-tight uppercase">
            Recover Access
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">
            Enter your email to receive a secure password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                <ShieldCheck size={32} />
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                If an account exists for <span className="font-bold text-slate-900">{email}</span>, a recovery link has been sent. Please check your inbox and spam folders.
              </p>
              <Link href="/login" className="text-xs font-bold text-green-600 hover:underline block pt-2 uppercase tracking-wider">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5">
                  Account Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-12 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "SEND RECOVERY LINK"}
              </Button>
              
              <div className="text-center pt-2">
                <Link href="/login" className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors">
                  <ArrowLeft size={12} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}