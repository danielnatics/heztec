import { createClient } from "@/lib/supabase/server";
import AdminProductList from "./AdminProductList";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Pass the data as a prop to the Client Component
  return <AdminProductList products={products || []} />;
}