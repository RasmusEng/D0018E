import React, { useState } from 'react';

// --- Create Specimen Button Component ---
const CreateSpecimenButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success', msg: string }>({ type: 'idle', msg: '' });

  const initialForm = {
    product_name: '', weight: '', height: '', length: '',
    diet: '', region: '', dino_type: '', description: '',
    image: '', stock: 0, price: 0, published: false
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;

    setFormData(prev => {
      // 1. Handle Checkboxes (booleans)
      if (type === 'checkbox') {
        return { ...prev, [name]: (target as HTMLInputElement).checked };
      }
      // 2. Handle Numbers (floats/integers)
      else if (type === 'number') {
        return { ...prev, [name]: value === '' ? 0 : parseFloat(value) };
      }
      // 3. Handle Standard Text Strings
      else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Synthesizing specimen data...' });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      // Inject amount_sold as 0 for brand new specimens
      const payload = { ...formData, amount_sold: 0 };

      const res = await fetch('/api/admin/create-product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error || 'Synthesis failed.' });
        return;
      }

      setStatus({ type: 'success', msg: 'Specimen successfully registered.' });
      onSuccess(); 

      setTimeout(() => {
        setIsOpen(false);
        setStatus({ type: 'idle', msg: '' });
        setFormData(initialForm); 
      }, 1500);

    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection to mainframe lost.' });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2"
      >
        <span>+</span> New Specimen
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden my-8">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
              <h3 className="text-zinc-100 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                Log New Specimen
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-rose-500 transition-colors text-xs font-black p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Designation (Name)</label>
                    <input type="text" name="product_name" required value={formData.product_name} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Classification (Type)</label>
                    <select
                      name="dino_type"
                      required
                      value={formData.dino_type}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Classification</option>
                      <option value="terrestrial">Terrestrial (Land)</option>
                      <option value="aquatic">Aquatic (Water)</option>
                      <option value="flying">Flying (Air)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Dietary Needs</label>
                    <select
                      name="diet"
                      required
                      value={formData.diet}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Classification</option>
                      <option value="carnivore">Carnivore</option>
                      <option value="herbivore">Herbivore</option>
                      <option value="omnivore">Omnivore</option>
                      <option value="piscivore">Piscivore</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Origin Region</label>
                    <select
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Region</option>
                      <option value="north america">North America</option>
                      <option value="south america">South America</option>
                      <option value="europe">Europe</option>
                      <option value="africa">Africa</option>
                      <option value="asia">Asia</option>
                      <option value="australia">Australia</option>
                      <option value="antarctica">Antarctica</option>
                    </select>
                  </div>
                </div>

                {/* Metrics & Commerce */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Weight</label>
                      <input type="text" name="weight" required value={formData.weight} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" placeholder="kg/tons" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Height</label>
                      <input type="text" name="height" required value={formData.height} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" placeholder="m/ft" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Length</label>
                      <input type="text" name="length" required value={formData.length} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" placeholder="m/ft" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Stock Vol.</label>
                      <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Valuation ($)</label>
                      <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors" placeholder="https://..." />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="published" id="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 accent-emerald-500 bg-zinc-900 border-zinc-800 rounded" />
                    <label htmlFor="published" className="text-[10px] font-black uppercase tracking-widest text-zinc-300 cursor-pointer">Make Publicly Available</label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">File Notes / Description</label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors resize-none" />
              </div>

              {/* Status & Submit */}
              {status.type !== 'idle' && (
                <div className={`text-[10px] font-mono font-bold uppercase p-2 border border-dashed rounded text-center
                  ${status.type === 'error' ? 'text-rose-500 border-rose-500/50 bg-rose-500/10' : ''}
                  ${status.type === 'loading' ? 'text-amber-500 border-amber-500/50 bg-amber-500/10 animate-pulse' : ''}
                  ${status.type === 'success' ? 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10' : ''}
                `}>
                  {status.msg}
                </div>
              )}

              <button type="submit" disabled={status.type === 'loading' || status.type === 'success'} className="w-full bg-emerald-500 text-black py-3 rounded font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {status.type === 'loading' ? 'Processing...' : 'Commit to Database'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSpecimenButton;