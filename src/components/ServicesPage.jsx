import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Cpu, Layers, Zap, ChevronRight, Wrench } from "lucide-react";

const TechnicalServiceCard = ({ id, title, subtitle, description, specs, icon: Icon, index, onSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    onClick={() => onSelect(id)}
    className="group bg-white border border-black/5 p-8 md:p-12 hover:bg-gray-50 transition-all duration-500 cursor-pointer"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="p-4 bg-gray-50 border border-black/5 text-[var(--color-halo-silver)] group-hover:border-[var(--color-halo-silver)]/30 group-hover:bg-[var(--color-halo-silver)]/5 transition-all duration-500">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div className="flex-grow">
        <span className="text-[10px] font-mono text-[var(--color-halo-silver)] uppercase tracking-[0.4em] mb-2 block font-bold">{subtitle}</span>
        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6 text-black group-hover:text-[var(--color-halo-silver)] transition-colors">{title}</h3>
        <p className="text-[12px] text-gray-500 uppercase leading-relaxed tracking-wider mb-8 max-w-2xl font-medium">{description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-black/5 pt-8">
          {specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[var(--color-halo-silver)]" />
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{spec}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 md:mt-0 p-4 border border-black/10 group-hover:border-[var(--color-halo-silver)] group-hover:bg-[var(--color-halo-silver)] transition-all">
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform group-hover:text-white" />
      </div>
    </div>
  </motion.div>
);

export default function ServicesPage({ onSelectService }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const detailedServices = [
    { id: "mechatronic-restoration", title: "Mechatronic Restoration", subtitle: "Electronic & Hydraulic Systems", description: "We specialize in board-level repairs and hydraulic pressure restoration for DQ200 and DQ250 units. Instead of costly dealer replacements, we rebuild your existing unit to exceed factory standards.", icon: Cpu, specs: ["Solenoid Testing", "Circuit Restoration", "Fluid Dynamics", "TCU Adaptation"] },
    { id: "dual-clutch-engineering", title: "Dual-Clutch Engineering", subtitle: "Mechanical Drive Systems", description: "Precision replacement and calibration of internal clutch packs for DSG, S-Tronic, and PDK transmissions. We use specialized LUK and OEM toolsets to ensure micron-perfect tolerances.", icon: Layers, specs: ["LUK RepSet", "PDK Calibration", "Clutch Shimming", "Wear-Analytic Reports"] },
    { id: "tcm-cloning", title: "TCM Cloning & Coding", subtitle: "Software Intelligence", description: "Proprietary data recovery and module cloning. If your transmission control module is dead, we can clone its data to a donor unit, saving you thousands in re-coding fees.", icon: Zap, specs: ["Data Recovery", "EEPROM Cloning", "Software Updates", "Anti-Theft Alignment"] },
    { id: "gearbox-overhaul", title: "Full Gearbox Overhaul", subtitle: "Structural Engineering", description: "A total teardown and rebuild of the transmission. Every bearing, seal, and gear is inspected and replaced if necessary. The ultimate solution for catastrophic mechanical failure.", icon: Settings, specs: ["12-Month Warranty", "OEM Seals", "Gear Alignment", "Full Dyno Testing"] }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-8 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto mb-24">
        <div className="inline-block px-3 py-1 bg-[var(--color-halo-silver)] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          Engineering Hub
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-black mb-8">
          Technical <br /><span className="text-[var(--color-halo-silver)]">Directory.</span>
        </h1>
        <p className="max-w-xl text-[11px] text-gray-500 uppercase tracking-[0.3em] leading-loose font-medium">
          Select a specialized service to view our engineering workflow, technical specifications, and warranty protocols.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-px bg-black/5 border border-black/5">
        {detailedServices.map((service, index) => (
          <TechnicalServiceCard key={service.id} index={index} onSelect={onSelectService} {...service} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-24 p-12 bg-gray-50 border border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-2">Unsure which service you need?</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Use our diagnostic terminal or contact an engineer directly.</p>
        </div>
        <button className="px-8 py-4 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
          Call Engineer
        </button>
      </div>
    </div>
  );
}
