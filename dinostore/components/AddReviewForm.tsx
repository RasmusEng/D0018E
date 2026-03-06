"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddReviewForm({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [grade, setGrade] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/review/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ "text": text, "grade": grade }),
      });

      if (res.ok) {
        setIsOpen(false);
        setText("");
        setGrade(5);
        router.refresh(); 
      } else {
        // THIS REVEALS THE SECRET:
        const errorText = await res.text();
        console.error(`SERVER ERROR [${res.status}]:`, errorText);
        alert(`Failed! Server said: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors border border-zinc-700 hover:border-emerald-500/50"
      >
        + Add Log
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">
              Submit Field Log
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Star Rating Selector */}
              <div>
                <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Specimen Grade
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setGrade(star)}
                      className={`text-2xl transition-colors ${star <= grade ? 'text-emerald-500' : 'text-zinc-700 hover:text-emerald-500/50'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Observation Notes
                </label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter observation details..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Transmitting..." : "Submit Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}