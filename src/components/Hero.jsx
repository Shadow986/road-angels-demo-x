import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, CheckCircle2 } from "lucide-react";

const backgrounds = [
  { url: '/hero-car.jpg', brand: 'Volkswagen' },
  { url: '/audi-rs3.png', brand: 'Audi' },
  { url: '/porsche-bg.png', brand: 'Porsche' }
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [ignite, setIgnite] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ brand: '', type: '', phone: '' });

  useEffect(() => {
    const timer = setTimeout(() => setIgnite(true), 800);
    const bgTimer = setInterval(() => setBgIndex((prev) => (prev + 1) % backgrounds.length), 6000);
    return () => { clearTimeout(timer); clearInterval(bgTimer); };
  }, []);

  const handleBrandSelect = (brand) => { setFormData({ ...formData, brand }); setStep(2); };

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-20 py-24 overflow-hidden bg-white">
      <AnimatePresence mode='wait'>
        <motion.div 
          key={bgIndex} 
          initial={{ opacity: 0, scale: 1.05 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }} 
          className="absolute inset-0"
        >
          <img src={backgrounds[bgIndex].url} className="w-full h-full object-cover brightness-[1.1] contrast-[1.0] saturate-[0.8]" alt="VAG Specialist Vehicle" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: ignite ? 1 : 0, x: ignite ? 0 : -30 }} 
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-[var(--color-vag-blue)] font-bold tracking-[0.3em] text-[10px] uppercase">
            <Zap size={14} className="fill-current" /> VAG GROUP SPECIALISTS
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter uppercase italic text-black">
            DSG <span className="text-gray-400">PRECISION.</span> <br />
            RESTORED.
          </h1>
          <p className="text-xs md:text-sm text-gray-500 max-w-md border-l-2 border-[var(--color-vag-blue)] pl-6 mb-8 uppercase tracking-[0.2em] leading-loose">
            Specializing in Clutch Replacement, Mechatronic Diagnostics, and Performance Gear Repairs for South Africa's elite VAG fleet.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 1.5 }}
            className="flex items-center justify-between mt-12 border-t border-black/5 pt-10 max-w-md mx-auto lg:mx-0"
          >
            <div className="flex justify-center flex-1">
              <img src="/assets/VW-logo.png" className="h-16 w-auto object-contain" alt="Volkswagen" />
            </div>
            <div className="flex justify-center flex-1">
              <img src="/assets/audi-logo.png" className="h-10 w-auto object-contain" alt="Audi" />
            </div>
            <div className="flex justify-center flex-1">
              <img src="/assets/Porsche-logo.png" className="h-20 w-auto object-contain" alt="Porsche" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: ignite ? 1 : 0, y: ignite ? 0 : 20 }}
          className="bg-white/95 backdrop-blur-3xl border border-black/10 p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md lg:ml-auto"
        >
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1 flex-1 transition-all duration-700 rounded-full ${step >= i ? 'bg-[var(--color-vag-blue)]' : 'bg-black/5'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-[10px] font-black mb-8 tracking-[0.3em] text-gray-400 uppercase">01. Select Brand</h3>
                <div className="space-y-3">
                  {["Audi", "Volkswagen", "Porsche"].map((brand) => (
                    <button 
                      key={brand} 
                      onClick={() => handleBrandSelect(brand)} 
                      className="w-full text-left p-5 bg-gray-50 border border-black/5 hover:border-[var(--color-vag-blue)] hover:bg-gray-100 transition-all flex justify-between items-center group uppercase text-[10px] tracking-widest font-black text-black"
                    >
                      {brand} <ChevronRight className="group-hover:translate-x-2 transition-transform text-[var(--color-vag-blue)]" size={16} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-[10px] font-black mb-8 tracking-[0.3em] text-gray-400 uppercase">02. Transmission Model</h3>
                <div className="space-y-3">
                  {["DQ200 (7-Speed)", "DQ250 (6-Speed)", "DL501 (S-Tronic)"].map((type) => (
                    <button 
                      key={type} 
                      onClick={() => { setFormData({...formData, type}); setStep(3); }} 
                      className="w-full text-left p-5 bg-gray-50 border border-black/5 hover:border-[var(--color-vag-blue)] transition-all uppercase text-[10px] tracking-widest font-black text-black"
                    >
                      {type}
                    </button>
                  ))}
                  <button onClick={() => setStep(1)} className="w-full text-center py-4 text-[8px] text-gray-400 font-bold tracking-widest uppercase mt-2">← Back</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 size={18} className="text-[var(--color-vag-blue)]" />
                  <h3 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Finalize Request</h3>
                </div>
                <input 
                  type="tel" 
                  placeholder="ENTER MOBILE NUMBER" 
                  className="w-full bg-gray-50 border border-black/10 p-5 mb-4 outline-none focus:border-[var(--color-vag-blue)] text-black font-black tracking-widest rounded-lg" 
                />
                <button className="w-full bg-[var(--color-vag-blue)] py-5 text-white font-black uppercase tracking-[0.3em] text-[11px] hover:brightness-125 transition-all rounded-lg shadow-lg">
                  Request Shift-Check
                </button>
                <button onClick={() => setStep(2)} className="w-full text-center py-4 text-[8px] text-gray-400 font-bold tracking-widest uppercase mt-2">Change details</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
