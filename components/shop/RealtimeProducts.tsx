"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/shop/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price?: number;
  images?: string[];
  category?: string;
  stock_quantity: number;
}

interface RealtimeProductsProps {
  initialProducts: Product[];
}

export default function RealtimeProducts({ initialProducts }: RealtimeProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const supabase = createClient();

  // Sync state if initial server products parameter updates via explicit sort filters
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    // Open a direct realtime broadcast connection to your 'products' table schema
    const channel = supabase
      .channel("realtime-shop-inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Realtime Inventory Update Detected:", payload);

          if (payload.eventType === "INSERT") {
            const newProduct = payload.new as Product;
            // Instantly prepend the new hardware product to the top of your shop matrix
            setProducts((prev) => [newProduct, ...prev]);
          } 
          
          else if (payload.eventType === "UPDATE") {
            const updatedProduct = payload.new as Product;
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
          } 
          
          else if (payload.eventType === "DELETE") {
            const deletedProduct = payload.old as { id: string };
            setProducts((prev) => prev.filter((p) => p.id !== deletedProduct.id));
          }
        }
      )
      .subscribe();

    // Clean up the active WebSocket channel listener thread when the user leaves the page
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (products.length === 0) {
    return (
      <div className="py-32 text-center border border-dashed border-slate-100 rounded-3xl">
        <p className="text-slate-400 font-medium text-sm italic">
          Our engineering lab currently has no inventory matching these parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-[600px]:max-[770px]:grid-cols-3 max-[600px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-5 py-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}