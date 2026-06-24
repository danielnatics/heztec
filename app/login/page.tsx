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
  LogIn,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if there is an intended target page redirecting here (like /cart)
  const redirectTo = searchParams.get("redirect") || "/";

  // If a session already exists, bypass the screen
  useEffect(() => {
    async function checkActiveSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
          toast.warning(
            "This email is already registered. Try signing in instead.",
          );
        } else if (data?.session) {
          toast.success("Account created successfully!");
          router.push(redirectTo);
          router.refresh();
        } else {
          toast.success(
            "Registration success! Check your email inbox for a verification link.",
          );
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
      // Note: We don't need to stop loading or route push here because 
      // the browser will physically redirect away to Google's login screen.
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4 font-sans">
      <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
        
        <CardHeader className="space-y-3 pb-4 text-center border-b border-slate-50 bg-slate-50/30 pt-8">
          <Link
            href="/"
            className="hidden inline-flex flex-col items-center gap-1 mx-auto group"
          >
            <div className="relative hidden w-14 h-14 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="HezTec"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-none hidden text-center">
              <span className="text-lg font-black tracking-tight text-slate-900 block">
                HezTec
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase block mt-0.5 text-green-600">
                Engineered Excellence
              </span>
            </div>
          </Link>
          <div className="space-y-1 pt-2">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              {isSignUp ? "Sign Up" : "Log In"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8 space-y-6">
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl font-medium focus-visible:ring-green-600"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-0.5">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-wider text-slate-400"
                >
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
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
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
              disabled={loading || googleLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-12 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 group text-sm cursor-pointer mt-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Loading...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus size={16} />
                  <span>REGISTER PROFILE</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>SIGN IN</span>
                </>
              )}
            </Button>
          </form>

          {/* OAUTH DIVIDER */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>
 */}
          {/* GOOGLE SIGN IN BUTTON */}
          {/* <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl font-bold text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-3 transition-colors"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin text-slate-400" size={18} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </>
            )}
          </Button> */}

          {/* DYNAMIC MODE TOGGLE ACCORDION FOOTER CONTAINER */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-500">
              {isSignUp
                ? "Already have a secure account?"
                : "New to the HezTec platform?"}{" "}
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}