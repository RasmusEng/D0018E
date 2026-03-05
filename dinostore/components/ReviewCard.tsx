"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

interface Review {
  name: string;
  review_text: string;
  grade: number;
  verified_customer: boolean;
  date: string;
  user_id: number;
  review_id: number;
}

export default function ReviewCard({ review }: { review: Review }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.review_text || "");
  const [editGrade, setEditGrade] = useState(review.grade || 5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Grab both userId and isAdmin from Zustand
  const { userId, isAdmin } = useAppStore();
  const router = useRouter();

  // Helper checks
  const isOwner = userId === review.user_id;
  const canDelete = isOwner || isAdmin;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`http://127.0.0.1:5000/review/${review.review_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText, grade: editGrade }),
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Failed to update: ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Added Delete Function
  const handleDelete = async () => {
    if (!confirm("Permanently delete this field log?")) return;
    
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/review/${review.review_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete log.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isEditing) {
    return (
      <div className="w-full bg-zinc-900 border border-emerald-500/50 p-8 rounded-[2rem] flex flex-col h-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <form onSubmit={handleUpdate} className="flex flex-col h-full gap-4">
          <div className="flex justify-between items-center mb-2">
             <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Editing Log</span>
             <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   type="button"
                   onClick={() => setEditGrade(star)}
                   className={`text-lg transition-colors ${star <= editGrade ? 'text-emerald-500' : 'text-zinc-700'}`}
                 >
                   ★
                 </button>
               ))}
             </div>
          </div>
          
          <textarea
            required
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-emerald-500 text-sm resize-none"
          />
          
          <div className="flex gap-2 mt-auto pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Log"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex flex-col h-full group">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < (review.grade || 0) ? 'text-emerald-500' : 'text-zinc-700'}`}>
                ★
              </span>
            ))}
          </div>

          {review.verified_customer && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest">
              Verified
            </span>
          )}
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mb-8">
          "{review.review_text || "No written feedback provided."}"
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 mt-auto">
        <div>
          <p className="text-white font-bold text-sm">{review.name}</p>
          <p className="text-zinc-600 text-[10px] font-mono">
            {review.date ? new Date(review.date).toLocaleDateString('sv-SE') : 'Unknown Date'}
          </p>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Owner can Edit */}
          {isOwner && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-zinc-500 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-zinc-800 hover:border-emerald-500/50 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          
          {/* Owner OR Admin can Delete */}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-zinc-500 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-zinc-800 hover:border-rose-500/50 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}