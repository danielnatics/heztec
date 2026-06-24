import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
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

  // 3. Fetch "You May Also Like"
  const { data: recommendations } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", id)
    .limit(10);

  // 4. Fetch Approved Reviews
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  // 5. Security Check: Can the user review this?
  const { data: { user } } = await supabase.auth.getUser();
  
  let canReview = false;
  let purchasedOrderId = null;

  if (user) {
    // Fetch orders AND existing reviews to prevent duplicates
    const [ordersRes, reviewsRes] = await Promise.all([
      supabase.from("orders").select("id, items, payment_status").eq("user_email", user.email),
      supabase.from("product_reviews").select("order_id, product_id").eq("user_email", user.email)
    ]);

    if (ordersRes.data) {
      const qualifyingOrder = ordersRes.data.find((order) => {
        const isDelivered = order.payment_status === "delivered";
        const hasProduct = order.items?.some((item: any) => item.id === product.id);
        
        // Check if this specific order/product combo has already been reviewed
        const alreadyReviewed = reviewsRes.data?.some(
          (r) => r.order_id === order.id && r.product_id === product.id
        );

        return isDelivered && hasProduct && !alreadyReviewed;
      });

      if (qualifyingOrder) {
        canReview = true;
        purchasedOrderId = qualifyingOrder.id;
      }
    }
  }

  return (
    <ProductDetailsClient 
      product={product} 
      recommendations={recommendations || []}
      reviews={reviews || []}
      hasPurchased={canReview} // Renamed logic to reflect ability to review
      purchasedOrderId={purchasedOrderId} // Pass this down!
      userEmail={user?.email || null}
    />
  );
}