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
    .limit(10);

  // 4. Fetch Approved Reviews for this product
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  // 5. Security Check: Is the user logged in and did they buy this item?
  const { data: { user } } = await supabase.auth.getUser();
  let hasPurchased = false;

  if (user) {
    // FIX 1: Select payment_status from the database
    const { data: userOrders } = await supabase
      .from("orders")
      .select("items, payment_status") 
      .eq("user_email", user.email);

    if (userOrders) {
      hasPurchased = userOrders.some((order) => {
        // FIX 2: Check the payment_status column for "completed" or "delivered"
        const isCompleted = order.payment_status === "completed" || order.payment_status === "delivered";
        const containsProduct = order.items?.some((item: any) => item.id === product.id);
        
        return isCompleted && containsProduct;
      });
    }
  }

  return (
    <ProductDetailsClient 
      product={product} 
      recommendations={recommendations || []}
      reviews={reviews || []}
      hasPurchased={hasPurchased}
      userEmail={user?.email || null}
    />
  );
}