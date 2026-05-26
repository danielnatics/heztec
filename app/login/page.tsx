"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ShieldAlert 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if there is an intended target page redirecting here (like /cart)
  const redirectTo = searchParams.get("redirect") || "/";

  // If a session already exists, bypass the screen
  useEffect(() => {
    async function checkActiveSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    }
    checkActiveSession();
  }, [supabase, router, redirectTo]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP PIPELINE ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });

        if (error) throw error;

        // Check if user needs to confirm email or if they are auto-logged in
        if (data?.user && data.user.identities?.length === 0) {
          toast.warning("This email is already registered. Try signing in instead.");
        } else if (data?.session) {
          toast.success("Account created successfully!");
          router.push(redirectTo);
          router.refresh();
        } else {
          toast.success("Registration success! Check your email inbox for a verification link.");
        }
      } else {
        // --- SIGN IN PIPELINE ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back to HezTec!");
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication error encountered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4 font-sans">
      <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
        
        {/* Brand/Identity Header Card Banner */}
        <CardHeader className="space-y-3 pb-4 text-center border-b border-slate-50 bg-slate-50/30 pt-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 mx-auto group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="HezTec" fill className="object-contain" priority />
            </div>
            <div className="leading-none text-center">
              <span className="text-lg font-black tracking-tight text-slate-900 block">HezTec</span>
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase block mt-0.5 text-green-600">
                Engineered Excellence
              </span>
            </div>
          </Link>
          <div className="space-y-1 pt-2">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {isSignUp ? "Create Lab Account" : "Access Ecosystem"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-medium">
              {isSignUp 
                ? "Register to log order specs, track components, and build cards." 
                : "Sign in to handle marketplace assets and system features."
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8 space-y-6">
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* EMAIL FIELD LINK */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                />
              </div>
            </div>

            {/* PASSWORD FIELD LINK */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-0.5">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Password
                </Label>
                {!isSignUp && (
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] font-bold text-green-600 hover:underline tracking-tight uppercase"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ACTION SUBMIT CTA ROW */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-12 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 group text-sm cursor-pointer mt-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>TRANSMITTING HANDSHAKE...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus size={16} />
                  <span>REGISTER LAB PROFILE</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>SECURE SIGN IN</span>
                </>
              )}
            </Button>
          </form>

          {/* DYNAMIC MODE TOGGLE ACCORDION FOOTER CONTAINER */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-500">
              {isSignUp ? "Already have a secure account?" : "New to the HezTec platform?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  toast.dismiss();
                }}
                className="text-green-600 font-bold hover:underline ml-1 cursor-pointer focus:outline-none"
              >
                {isSignUp ? "Sign In Here" : "Create Account Here"}
              </button>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

// Wrap inside Suspense boundary to cleanly support searchParams usage inside Next.js App Router architectures
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  );
}