"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!");
      router.push("/login"); 
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4 font-sans">
      <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="space-y-3 pb-4 text-center border-b border-slate-50 bg-slate-50/30 pt-8">
          <CardTitle className="text-xl font-black text-slate-900 tracking-tight uppercase">
            Set New Password
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">
            Please enter your new secure password below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8 space-y-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-0.5">
                New Password
              </Label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-12 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "SECURE NEW PASSWORD"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}