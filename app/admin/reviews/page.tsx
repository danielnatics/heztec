"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Review {
  id: string;
  product_id: string;
  user_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    // Fetch all reviews, newest first
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    } else if (error) {
      toast.error("Failed to fetch reviews: " + error.message);
    }
    setLoading(false);
  }

  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    setUpdatingId(reviewId);
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from("product_reviews")
        .update({ is_approved: newStatus })
        .eq("id", reviewId);

      if (error) throw error;

      toast.success(
        newStatus ? "Review approved and is now live!" : "Review hidden from public."
      );
      
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, is_approved: newStatus } : r
        )
      );
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;

    setUpdatingId(reviewId);
    try {
      const { error } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast.success("Review deleted permanently.");
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error: any) {
      toast.error("Failed to delete review: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-slate-900 uppercase">
            Review Moderation
          </h1>
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
            Total Reviews: {reviews.length}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-200 rounded-3xl bg-white">
            <Star size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium text-sm">
              No product reviews have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col"
              >
                {/* Header: Status and Date */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {new Date(review.created_at).toLocaleString("en-NG")}
                    </p>
                    <Link
                      href={`/shop/${review.product_id}`}
                      target="_blank"
                      className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 mt-1 group"
                    >
                      View Product <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                  {review.is_approved ? (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-md border border-green-200 flex items-center gap-1">
                      <Eye size={12} /> Live
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-md border border-amber-200 flex items-center gap-1">
                      <EyeOff size={12} /> Pending
                    </span>
                  )}
                </div>

                {/* Body: Rating, User, Comment */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-800">
                      {review.user_email}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {/* Approve / Hide Toggle */}
                  <button
                    onClick={() => toggleApproval(review.id, review.is_approved)}
                    disabled={updatingId === review.id}
                    className={`flex-1 text-white text-xs font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors ${
                      review.is_approved
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {updatingId === review.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : review.is_approved ? (
                      <XCircle size={14} />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                    {review.is_approved ? "Unapprove (Hide)" : "Approve (Publish)"}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteReview(review.id)}
                    disabled={updatingId === review.id}
                    className="px-4 border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold py-2.5 rounded-lg transition-colors"
                    title="Permanently Delete Review"
                  >
                    {updatingId === review.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}