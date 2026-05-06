import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Properly unwrap the asynchronous params for Next.js 15
  const { id } = await params;
  const supabase = await createClient();

  // 2. Fetch the main hardware component
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return notFound();
  }

  // 3. Fetch "You May Also Like" (Same category, excluding current item)
  const { data: recommendations } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", id)
    .limit(4);

  return (
    <ProductDetailsClient 
      product={product} 
      recommendations={recommendations || []} 
    />
  );
}