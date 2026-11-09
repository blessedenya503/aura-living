"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquare, Send, Sparkles, User, ThumbsUp } from "lucide-react";

export interface UserReview {
  id: string;
  author: string;
  location?: string;
  rating: number;
  title: string;
  comment: string;
  productName?: string;
  brand?: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    author: "",
    location: "Lagos, Nigeria",
    rating: 5,
    title: "",
    comment: "",
    productName: "",
    brand: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch {
      // Ignore initial fetch error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.author.trim() || !form.comment.trim()) {
      setErrorMsg("Please provide your name and review message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Thank you! Your verified review has been published.");
        setReviews((prev) => [data.review, ...prev]);
        setForm({
          author: "",
          location: "Lagos, Nigeria",
          rating: 5,
          title: "",
          comment: "",
          productName: "",
          brand: "",
        });
        setShowForm(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Failed to publish review. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#002B7F] text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Customer Experiences &amp; Reviews
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Read authentic feedback from skincare customers around the world.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#002B7F] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Review Submission Form Drawer/Modal */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md animate-fadeIn"
          >
            <h3 className="text-base font-bold text-slate-950 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Share Your Honest Experience</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Your feedback helps fellow skincare shoppers make informed routine choices.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amara Okafor"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#002B7F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  placeholder="e.g. London, UK or Toronto, Canada"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#002B7F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product / Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. COSRX Snail 96 Mucin or CeraVe"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#002B7F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rating (Stars)
                </label>
                <div className="flex items-center gap-1.5 h-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= form.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {form.rating} out of 5
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Transformed my skin barrier in 1 week!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#002B7F]"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tell us about the texture, hydration, how it felt on your skin, delivery experience, etc."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#002B7F]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#002B7F] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Post Review"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Reviews List / Empty State */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading customer reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-14 text-center bg-white rounded-3xl border border-slate-200/80 my-8 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No customer reviews yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Be the first verified customer to share your thoughts, routine results, and feedback!
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-xl bg-[#002B7F] text-white text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {rev.date}
                    </span>
                  </div>

                  {rev.title && (
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                      {rev.title}
                    </h4>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {rev.productName && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-[#002B7F] font-semibold">
                      <span className="text-slate-400 font-normal">Item:</span>
                      <span className="truncate">{rev.productName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rev.author}</span>
                    {rev.location && (
                      <span className="text-slate-400 text-[11px]">({rev.location})</span>
                    )}
                  </div>
                  {rev.verified && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
