import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Shield, Activity } from 'lucide-react';

const serviceDetails = {
  "mechatronic-restoration": {
    title: "Mechatronic Restoration",
    subtitle: "Unit Logic & Hydraulics",
    stats: { recovery: "98%", time: "48-72h", warranty: "12 Months" },
    content: "Specialized board-level repair for VAG Mechatronic units (DQ200, DQ250, DQ500, DL501). We address the root cause of pressure loss and component failure without requiring a full unit replacement.",
    process: ["Ultrasonic cleaning of hydraulic channels", "Solenoid performance mapping", "TCU board reflowing & sealing", "High-pressure leak testing"]
  },
  "dual-clutch-engineering": {
    title: "Dual-Clutch Engineering",
    subtitle: "Mechanical Drive Systems",
    stats: { recovery: "100%", time: "24-48h", warranty: "12 Months" },
    content: "Precision installation of LUK or OEM clutch packs. We utilize specialized shimming tools to ensure factory-spec clearances, preventing the 'shudder' common in amateur installs.",
    process: ["Measurement of K1/K2 play", "Precision shimming and alignment", "Needle bearing replacement", "Basic setting adaptation"]
  },
  "tcm-cloning": {
    title: "TCM Cloning & Coding",
    subtitle: "Software Intelligence",
    stats: { success: "99%", time: "Same Day", cost: "Reduction -60%" },
    content: "Proprietary hex-data recovery and module cloning. If your transmission control module is hardware-failed, we can clone its VIN and adaptation data to a donor unit, bypassing dealership component protection.",
    process: ["Full EEPROM/Flash Backup", "Sector-by-sector data cloning", "Checksum validation", "VAG Component Protection alignment"]
  },
  "gearbox-overhaul": {
    title: "Full Gearbox Overhaul",
    subtitle: "Structural Engineering",
    stats: { tolerance: "0.01mm", parts: "OEM Only", warranty: "24 Months" },
    content: "A complete mechanical restoration. We strip the transmission to the casing, replacing all syncros, bearings, and seals. This is the ultimate solution for high-mileage failures or catastrophic gear damage.",
    process: ["Complete chemical casing wash", "Hard-part integrity inspection", "Internal seal & gasket replacement", "Dynamic load testing"]
  }
};

export default function ServiceDetailView({ serviceId, onBack }) {
  const data = serviceDetails[serviceId];

  if (!data) return (
    <div className="pt-40 text-center uppercase tracking-widest text-gray-400">
      Service Data Not Found
      <button onClick={onBack} className="block mx-auto mt-4 text-[var(--color-halo-silver)]">Return Home</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white min-h-screen pt-32 pb-20 px-8 md:px-20">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to engineering hub
        </button>

        <div className="grid md:grid-cols-2 gap-16 mb-20 border-b border-black/5 pb-20">
          <div>
            <span className="text-[10px] font-mono text-[var(--color-halo-silver)] uppercase tracking-[0.5em] mb-4 block font-bold">
              {data.subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-black leading-none mb-8">
              {data.title.split(' ')[0]} <br />
              <span className="text-[var(--color-halo-silver)]">{data.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-[12px] text-gray-500 uppercase tracking-widest leading-loose font-medium">{data.content}</p>
          </div>

          <div className="bg-gray-50 border border-black/5 p-8 flex flex-col justify-center gap-8">
            {Object.entries(data.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-end border-b border-black/5 pb-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">{key}</span>
                <span className="text-xl font-black italic text-black uppercase tracking-tighter">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black mb-10 flex items-center gap-3">
              <Activity size={16} className="text-[var(--color-halo-silver)]" /> Engineering Workflow
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {data.process.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 border border-black/5">
                  <CheckCircle2 size={16} className="text-[var(--color-halo-silver)] mt-1 shrink-0" />
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-halo-silver)] p-8 flex flex-col justify-between group">
            <Shield size={40} className="text-white mb-12" />
            <div>
              <h4 className="text-xl font-black italic uppercase text-white mb-4 leading-tight">Engineering Bond Included.</h4>
              <p className="text-[9px] text-white/70 uppercase tracking-widest leading-loose mb-8 font-bold">
                Every repair unit carries a unique digital serial signature and workmanship bond.
              </p>
              <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Book Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
