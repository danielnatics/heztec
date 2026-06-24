"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  userEmail: string | null;
}

export default function ProductReviewForm({ productId, userEmail }: ReviewFormProps) {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return toast.error("Please sign in to leave a review.");
    if (rating === 0) return toast.error("Please select a star rating.");
    if (!comment.trim()) return toast.error("Please write a review.");

    setLoading(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_email: userEmail,
        rating,
        comment: comment.trim(),
      });

      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // If they aren't logged in, don't let them review
  if (!userEmail) {
    return (
      <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
        <p className="text-sm font-medium text-slate-600">Please sign in to review this component.</p>
      </div>
    );
  }

  // If they just submitted, show a thank you message
  if (submitted) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
        <p className="font-bold">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-4">
      <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Write a Review</h3>
      
      {/* 5-Star Interactive Selector */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400" // Filled yellow if hovered or selected
                  : "text-slate-300" // Empty gray otherwise
              }`}
            />
          </button>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How did this component work for your project?"
        className="w-full min-h-[100px] p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        Post Review
      </Button>
    </form>
  );
}