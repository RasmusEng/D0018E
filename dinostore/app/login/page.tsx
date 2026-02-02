import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 selection:bg-emerald-500/30">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-tighter italic">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">DINO</span>
            <span className="text-white">STORE</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Geneticist ID (Email)
              </label>
              <input 
                type="email" 
                placeholder="johnn@hammond.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Access Phrase
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-transform active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
              INITIALIZE SESSION
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <Link href="#" className="text-zinc-500 hover:text-emerald-400 transition-colors">
              Forgot Access?
            </Link>
            <Link href="#" className="text-emerald-500 hover:text-white transition-colors">
              Request DNA Access
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-zinc-600 text-[10px] uppercase tracking-widest leading-loose">
        </p>
      </div>
    </div>
  );
}