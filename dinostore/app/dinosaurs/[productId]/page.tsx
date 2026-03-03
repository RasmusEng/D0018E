import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

interface Review {
  name: string;
  review_text: string;
  grade: number;
  verified_customer: boolean;
  date: string;
  user_id: number;
}

async function getDinoData(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/products/${id}`, {
      cache: 'no-store' // Disabled cache for development
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }

    if (data && Object.keys(data).length === 0) return null;

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function getReviewsData(productId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/review/${productId}`, {
      cache: 'no-store' // Disabled cache for development
    });

    if (!res.ok) return { average_grading: "0.0", reviews: [] };
    
    const data = await res.json();
    
    // If the API returns a direct array (as seen in your logs)
    if (Array.isArray(data)) {
      // Calculate the average dynamically!
      const totalGrade = data.reduce((sum, review) => sum + (review.grade || 0), 0);
      const avg = data.length > 0 ? (totalGrade / data.length).toFixed(1) : "0.0";
      
      return { average_grading: avg, reviews: data };
    }

    // Fallback just in case you update your backend later to return an object
    return {
      average_grading: data.average_grading || "0.0",
      reviews: Array.isArray(data.reviews) ? (data.reviews as Review[]) : []
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { average_grading: "0.0", reviews: [] };
  }
}

export default async function DinoDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const [dino, reviewData] = await Promise.all([
    getDinoData(productId),
    getReviewsData(productId)
  ]);

  const { average_grading, reviews } = reviewData;

  if (!dino) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="mb-6 h-20 w-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-700 font-black text-4xl">!</div>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Specimen Not Found</h1>
        <p className="text-zinc-500 mb-8 max-w-md">The dinosaur "{dino?.name || 'requested'}" is missing from our fossil records or has been moved to a classified sector.</p>
        <Link href="/" className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 rounded-2xl font-black uppercase text-xs transition-all">
          Return to Lab
        </Link>
      </div>
    );
  }

  const isCarnivore = dino.diet?.toLowerCase().includes("carnivore");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <Link href="/" className="group mb-12 inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-emerald-500 transition-colors">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Scientific Image Display */}
          <div className="relative aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50" />
            <Image
              src={dino.image || "/placeholder-dino.jpg"}
              alt={dino.name || "Dinosaur specimen"}
              fill
              priority
              className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>

          {/* Biological Data */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isCarnivore ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'}`} />
              <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
                {dino.type || 'Terrestrial'} // {dino.diet}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black capitalize mb-8 leading-[0.9] tracking-tighter">
              {dino.name}
            </h1>

            <div className="space-y-10">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full" />
                <h2 className="text-zinc-600 font-black uppercase text-[10px] tracking-widest mb-3">Field Notes</h2>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed italic font-medium">
                  "{dino.description}"
                </p>
              </div>

              {/* Stats Matrix */}
              <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-xl">
                <StatBox label="Mass" value={dino.weight} />
                <StatBox label="Height" value={dino.height} />
                <StatBox label="Origin" value={dino.region} highlight />
                <StatBox label="Length" value={dino.length} />
              </div>

              <div className="pt-4">
                <button className="group relative w-full overflow-hidden bg-white hover:bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all duration-300 uppercase tracking-widest text-xs active:scale-[0.98]">
                  <span className="relative z-10">Initialize Acquisition</span>
                  <div className="absolute inset-0 bg-emerald-400 translate-y-full transition-transform group-hover:translate-y-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <section className="mt-24 pt-16 border-t border-zinc-800/50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Researcher Logs</h2>
              <p className="text-zinc-500 text-sm font-medium">Verified field assessments for {dino.name}</p>
            </div>
            {/* Now displays the calculated average dynamically! */}
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
              <span className="text-emerald-500">★</span>
              <span className="font-bold text-white">{average_grading}</span>
              <span className="text-zinc-500 text-xs">/ 5.0 Global Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review: Review, index: number) => {
              // Using user_id as the key since your API trace showed user_id instead of review_id
              const safeKey = review.user_id ? `user-${review.user_id}` : `review-fallback-${index}`;
              return <ReviewCard key={safeKey} review={review} />;
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

// Small helper component for Stats
function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="bg-zinc-950 p-6 md:p-8">
      <p className="text-zinc-600 text-[10px] font-black uppercase mb-2 tracking-widest">{label}</p>
      <p className={`text-xl md:text-2xl font-bold truncate ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value || '---'}
      </p>
    </div>
  );
}

// Small helper component for Reviews
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {/* Dynamic Stars based on review.grade */}
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < (review.grade || 0) ? 'text-emerald-500' : 'text-zinc-700'}`}>
                ★
              </span>
            ))}
          </div>
          
          {/* Verified Customer Badge */}
          {review.verified_customer && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest">
              Verified
            </span>
          )}
        </div>

        {/* Dynamic Review Text */}
        <p className="text-zinc-300 leading-relaxed text-sm mb-8">
          "{review.review_text || "No written feedback provided."}"
        </p>
      </div>
      
      <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 mt-auto">
        <div>
          <p className="text-white font-bold text-sm">{review.name}</p>
        </div>
        <p className="text-zinc-600 text-xs font-mono">
          {review.date ? new Date(review.date).toLocaleDateString('sv-SE') : 'Unknown Date'}
        </p>
      </div>
    </div>
  );
}