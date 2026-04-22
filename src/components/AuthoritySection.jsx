import { motion } from "framer-motion";
import { ShieldCheck, Globe, Wrench, History, Award } from "lucide-react";

export default function AuthoritySection() {
  return (
    <section className="py-24 bg-[#050505] text-white px-8 md:px-20 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[var(--color-halo-silver)]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* LEFT: THE STORY & LEGACY */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--color-halo-silver)]/30 text-[var(--color-halo-silver)] text-[9px] font-black uppercase tracking-[0.4em]">
              <History size={12} /> Established 2004
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85]">
              Two Decades of <br /><span className="text-[var(--color-halo-silver)]">Precision.</span>
            </h2>
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] leading-loose max-w-md">
              Our journey began in Botswana, where precision engineering laid the foundation for our esteemed reputation. Today, registered in both <span className="text-white font-bold">Botswana and South Africa</span>, Road Angels RSA stands as a beacon of reliability.
            </p>
          </div>

          <div className="grid gap-8">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white/[0.03] text-[var(--color-halo-silver)] border border-white/5">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">Cross-Border Expertise</h4>
                <p className="text-[10px] text-gray-600 uppercase leading-relaxed">
                  Dual-registered as your trusted partners for the optimal performance of your Audi, VW, and Porsche.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white/[0.03] text-[var(--color-halo-silver)] border border-white/5">
                <Wrench size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">Hydraulic Mastery</h4>
                <p className="text-[10px] text-gray-600 uppercase leading-relaxed font-medium">
                  Seasoned technicians specializing in the intricate hydraulics and pneumatics of VAG transmissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: THE TEAM VISUAL */}
        <div className="relative group">
          <div className="aspect-square bg-[#0a0a0a] border border-white/10 relative overflow-hidden p-3 shadow-2xl">
            <div className="w-full h-full relative overflow-hidden bg-black">
                {/* Referencing the Team.jpg in your public folder */}
                <img 
                  src="/Team.jpg" 
                  alt="Road Angels Engineering Team" 
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:scale-105 group-hover:opacity-80 transition-all duration-[4s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Visual HUD overlay inspired by image_79933c.jpg */}
                <div className="absolute bottom-6 left-6 border-l-2 border-[var(--color-halo-silver)] pl-4 py-2 bg-black/40 backdrop-blur-sm">
                    <p className="text-[7px] text-[var(--color-halo-silver)] font-mono uppercase tracking-[0.4em] mb-1">Squad_Deployment</p>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest">RSA Specialist Engineering Floor</p>
                </div>
            </div>
            
            {/* Trust Badge */}
            <div className="absolute -top-4 -right-4 bg-[var(--color-halo-silver)] p-6 hidden lg:block shadow-xl">
                <Award size={24} className="text-white" />
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5">
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.6em] text-center leading-relaxed">
          Unparalleled Performance and Reliability // Road Angels RSA // Gauteng Hub
        </p>
      </div>
    </section>
  );
}