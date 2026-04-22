import { motion } from "framer-motion";
import { Star, ShieldCheck, MapPin, Award } from "lucide-react";

export default function ValidationSection() {
  const cases = [
    { model: "Audi S3 (8V)", location: "Sandton, GP", fault: "P0805 - Clutch Sensor", result: "Board-Level Restoration", quote: "Dealer quoted R65k for a new unit. Road Angels restored mine in 48 hours for a fraction of the cost.", client: "Thabo M." },
    { model: "VW Golf 7 GTI", location: "Pretoria, GP", fault: "P17BF - Hydraulic Pump", result: "Reinforced Accumulator Fix", quote: "The flashing spanner is gone. Car shifts smoother than factory. Professional engineering team.", client: "Gareth W." },
    { model: "Porsche Macan S", location: "Bedfordview, GP", fault: "TCM Communication Error", result: "Software/Hardware Clone", quote: "Expert knowledge on the DL501 gearbox. Highly recommend for high-performance VAG owners.", client: "Pillay S." }
  ];

  return (
    <section className="py-24 bg-gray-50 text-black px-8 md:px-20 border-t border-black/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-halo-silver)] text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Restoration Archive
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
              Proven on the <br /><span className="text-[var(--color-halo-silver)]">Tarmac.</span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] leading-relaxed">
              VAG Specialist POC: 7,000+ Verified Deployments across RSA.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="flex items-center justify-end gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="var(--color-halo-silver)" color="var(--color-halo-silver)" />)}
            </div>
            <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest italic">MEMBER_RATING: 4.9/5</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/5 border border-black/5">
          {cases.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white flex flex-col justify-between hover:bg-gray-50 transition-all duration-500 relative"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--color-halo-silver)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-mono text-[var(--color-halo-silver)] font-bold tracking-tighter">{item.fault}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin size={8} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.location}</span>
                  </div>
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-black group-hover:text-[var(--color-halo-silver)] transition-colors">{item.model}</h4>
                <p className="text-[11px] text-gray-500 uppercase leading-relaxed mb-10 tracking-wide font-medium h-20 overflow-hidden">"{item.quote}"</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-black/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{item.client}</span>
                  <span className="text-[8px] font-mono text-gray-400 uppercase">{item.result}</span>
                </div>
                <ShieldCheck size={14} className="text-gray-300 group-hover:text-[var(--color-halo-silver)] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-10 border border-black/5 bg-white flex flex-col md:flex-row items-center justify-between gap-8 group shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 border border-[var(--color-halo-silver)]/20 rounded-full group-hover:border-[var(--color-halo-silver)]/50 transition-colors">
              <Award size={24} className="text-[var(--color-halo-silver)]" />
            </div>
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight text-black mb-1">The 12-Month Engineering Bond</h3>
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">Certified 30,000km Structural & Electronic Guarantee.</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-[var(--color-halo-silver)] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all">
            Secure My Restoration
          </button>
        </div>
      </div>
    </section>
  );
}
