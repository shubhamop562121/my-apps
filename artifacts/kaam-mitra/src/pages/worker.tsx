import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, BadgeCheck,
  Bookmark, Briefcase, Shield, CalendarDays, Loader2,
  MessageSquarePlus, Send, CheckCircle2,
} from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import { useReviews, addReview } from "@/hooks/useReviews";
import { formatDate } from "@/lib/formatDate";
import AdBanner from "@/components/AdBanner";

export default function WorkerDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/worker/:id");
  const { workers, loading } = useWorkers();
  const { isSaved, toggleSave } = useSaved();
  const { user } = useAuth();
  const { reviews } = useReviews(params?.id);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const worker = workers.find((w) => w.id === params?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading worker profile…</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-muted-foreground">Worker not found.</p>
        <button onClick={() => setLocation("/home")} className="text-sm text-primary font-semibold">Go Home</button>
      </div>
    );
  }

  const saved = isSaved(worker.id);
  const initials = worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700", "bg-rose-100 text-rose-700"];
  const colorClass = bgColors[worker.id.charCodeAt(worker.id.length - 1) % bgColors.length];

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : worker.rating;
  const reviewCount = reviews.length || worker.reviewCount;

  const handleSubmitReview = async () => {
    const name = reviewerName.trim() || user?.displayName || user?.phoneNumber || "KaamMitra User";
    if (!comment.trim()) {
      setReviewError("Please write a short comment.");
      return;
    }
    setSubmitting(true);
    setReviewError("");
    try {
      await addReview({
        workerId: worker.id,
        workerName: worker.name,
        userName: name,
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setShowForm(false);
      setComment("");
      setReviewerName("");
      setRating(5);
    } catch (err) {
      console.error("addReview failed:", err);
      setReviewError("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative bg-primary pt-14 pb-20 px-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button
            onClick={() => toggleSave(worker.id)}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-save"
          >
            <Bookmark size={20} className={saved ? "text-white fill-white" : "text-white"} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-14">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-5"
        >
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${colorClass}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{worker.name}</h1>
                {worker.verified && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={12} className="text-primary" />
                    <span className="text-[10px] font-semibold text-primary">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{worker.profession}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{worker.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-foreground">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Briefcase size={14} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.experience}+</p>
              <p className="text-[10px] text-muted-foreground">Years Exp.</p>
            </div>
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star size={14} className="text-amber-400" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.rating}</p>
              <p className="text-[10px] text-muted-foreground">Rating</p>
            </div>
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Shield size={14} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.verified ? "Yes" : "No"}</p>
              <p className="text-[10px] text-muted-foreground">Verified</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 bg-white rounded-3xl shadow-sm border border-border p-5"
        >
          <h2 className="font-bold text-sm text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{worker.about}</p>
        </motion.div>

        {worker.services.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-4 bg-white rounded-3xl shadow-sm border border-border p-5"
          >
            <h2 className="font-bold text-sm text-foreground mb-3">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {worker.services.map((s) => (
                <span
                  key={s}
                  className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <AdBanner position="Worker Detail" className="mt-4" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mt-4 bg-white rounded-3xl shadow-sm border border-border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-foreground">
              Reviews {reviews.length > 0 && <span className="text-muted-foreground font-normal">({reviews.length})</span>}
            </h2>
            <button
              onClick={() => { setShowForm((s) => !s); setSubmitted(false); setReviewError(""); }}
              className="flex items-center gap-1 text-xs font-semibold text-primary"
              data-testid="btn-write-review"
            >
              <MessageSquarePlus size={14} />
              Write a review
            </button>
          </div>

          {submitted && (
            <div className="mb-3 bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700">Thanks! Your review was submitted and will appear once approved.</p>
            </div>
          )}

          {showForm && (
            <div className="mb-4 bg-muted rounded-2xl p-4 flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      data-testid={`star-${n}`}
                      aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={24}
                        className={n <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/40"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Your Name (optional)</label>
                <input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="How should we show your name?"
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-reviewer-name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this worker…"
                  rows={3}
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-review-comment"
                />
              </div>
              {reviewError && <p className="text-xs text-destructive">{reviewError}</p>}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                data-testid="btn-submit-review"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{r.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={12}
                          className={n <= r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.comment}</p>
                  {formatDate(r.createdAt) && (
                    <p className="text-[11px] text-muted-foreground/70 mt-1">{formatDate(r.createdAt)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">Secure Booking</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Book your appointment through KaamMitra. Our team will verify and assign the right worker for your job.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 pb-8">
          <button
            onClick={() => setLocation(`/book/${worker.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-md"
            data-testid="btn-book"
          >
            <CalendarDays size={18} />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
