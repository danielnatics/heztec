"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "/admin"; // Redirect to your dashboard
  };

  return (
    <div className="flex h-screen items-center justify-center bg-emerald-50/30">
      <Card className="w-full max-w-md border-emerald-100">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-950">HezTec Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <Button className="w-full bg-emerald-600">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}