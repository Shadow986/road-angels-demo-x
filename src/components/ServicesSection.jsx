import { motion } from "framer-motion";
import { Cpu, ArrowUpRight, Cog, Layers } from "lucide-react";

export default function ServicesSection() {
  const services = [
    { title: "Gearbox Overhaul", desc: "Comprehensive mechanical rebuilds for DQ200, DQ250, and DL501 units. Specialized precision for Audi, VW, and Porsche.", icon: <Cog size={20} className="text-[var(--color-halo-silver)]" />, tags: ["AUDI", "VW", "PORSCHE"] },
    { title: "Clutch Replacement", desc: "Expert replacement of dual-clutch packs and flywheels. We restore factory shift response and torque handling.", icon: <Layers size={20} className="text-[var(--color-halo-silver)]" />, tags: ["CLUTCH", "DSG", "S-TRONIC"] },
    { title: "Online Programming", desc: "Advanced software solutions including TCM programming, mechanical gear repair, and mechatronic diagnostics.", icon: <Cpu size={20} className="text-[var(--color-halo-silver)]" />, tags: ["PROGRAMMING", "SOFTWARE", "GEARS"] }
  ];

  return (
    <section id="services" className="py-24 bg-white text-black px-8 md:px-20 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-halo-silver)] text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              VAG Technical Capabilities
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85]">
              DSG Specialist <br /><span className="text-[var(--color-halo-silver)]">Services.</span>
            </h2>
          </div>
          <button className="px-8 py-4 border border-black/10 hover:border-[var(--color-vag-blue)] transition-all flex items-center gap-4 group">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Explore Full Specs</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/5 border border-black/5">
          {services.map((s, i) => (
            <motion.div key={i} className="group p-10 bg-white hover:bg-gray-50 transition-all duration-500 relative">
              <div className="p-3 bg-gray-50 border border-black/5 text-[var(--color-halo-silver)] mb-8 inline-block">
                {s.icon}
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-black group-hover:text-[var(--color-vag-blue)] transition-colors">{s.title}</h3>
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed mb-8 tracking-wider font-medium">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[7px] font-black text-gray-400 border border-black/5 uppercase">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
