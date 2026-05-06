"use client"; // This is the key to fixing the error

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DeleteProps {
  productId: string;
  productName: string;
  images: string[];
}

export default function DeleteProductButton({ productId, productName, images }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${productName}"? This will also remove its images from storage.`);
    
    if (!confirmDelete) return;

    setIsDeleting(true);
    const supabase = createClient();

    // 1. Storage Cleanup
    if (images && images.length > 0) {
      const pathsToDelete = images.map(url => {
        const parts = url.split('/');
        return parts.slice(parts.indexOf('products') + 1).join('/');
      });
      await supabase.storage.from('products').remove(pathsToDelete);
    }

    // 2. Database Cleanup
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert("Error: " + error.message);
      setIsDeleting(false);
    } else {
      router.refresh(); // Updates the table without a full page reload
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled={isDeleting}
      onClick={handleDelete}
      className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
    >
      {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </Button>
  );
}