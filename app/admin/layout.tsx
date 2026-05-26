import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

// Master administrative email address threshold rule
const ALLOWED_ADMIN_EMAIL = "getheztec@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Fetch user profile context from Supabase securely on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Clear out unauthenticated traffic sessions
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // 3. Reject emails that don't match your master email threshold
  if (user.email !== ALLOWED_ADMIN_EMAIL) {
    redirect("/login?redirect=/admin");
  }

  // 4. If clean, pass children elements safely forward into your structural layout shell
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}