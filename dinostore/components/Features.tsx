const FEATURES = [
  { icon: "🧬", title: "Pure DNA", color: "from-emerald-400 to-cyan-500", desc: "No frog gaps. 100% genuine Cretaceous code." },
  { icon: "🚁", title: "Apex Air", color: "from-amber-400 to-orange-500", desc: "Pterodactyl-guaranteed delivery in 48 hours." },
  { icon: "🛡️", title: "Liability Safe", color: "from-rose-400 to-purple-500", desc: "Iron-clad waivers included with every T-Rex." },
];

export default function Features() {
  return (
    <section className="w-full bg-zinc-950 py-24 border-y border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, i) => (
            <div key={i} className="relative group rounded-3xl bg-zinc-900/50 p-8 border border-zinc-800 hover:bg-zinc-900 transition-all">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-2xl shadow-lg`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{feat.title}</h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}