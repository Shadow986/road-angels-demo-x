import React from "react";
import { Trophy, ChevronRight, CheckCircle2 } from "lucide-react";

const BadgeTierCard = ({ trophyColor, title, goal, description, features }) => (
  <div className="flex flex-col bg-white border border-black/5 p-10 hover:border-black/10 transition-all duration-500 group relative">
    <div className="w-16 h-16 flex items-center justify-center border border-black/10 bg-gray-50 mb-10">
      <Trophy size={28} color={trophyColor} strokeWidth={1.5} />
    </div>
    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-2">{title}</h3>
    <p className="text-[10px] font-black uppercase tracking-widest mb-6 text-gray-400">{goal} Goal</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed font-bold mb-10">"{description}"</p>
    <div className="space-y-4 pt-8 border-t border-black/5">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <CheckCircle2 size={14} className="text-[var(--color-vag-blue)]" />
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function MembershipPage() {
  const badgeTiers = [
    { title: "Bronze Badge", goal: "4 Months", description: "Unlocks a free DSG gearbox service including oil and filters after 4 months.", trophyColor: "#cd7f32", features: ["DSG Gearbox Discounts", "Software Updates"] },
    { title: "Silver Badge", goal: "12 Months", description: "Massive savings on gearbox services and Clutch Replacement after one year.", trophyColor: "#c0c0c0", features: ["Priority Workshop Slot", "Clutch Diagnostics"] },
    { title: "Gold Badge", goal: "24 Months", description: "The ultimate package: Half-price overhauls and flexible payment plans.", trophyColor: "#ffd700", features: ["50% Off Major Repairs", "Free Loan Vehicle"] }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-8 md:px-20">
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-black">
          THE <span className="text-[var(--color-vag-blue)]">ANGEL</span> BOND.
        </h1>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-px bg-black/5 border border-black/5 mb-24">
        {badgeTiers.map((tier, i) => <BadgeTierCard key={i} {...tier} />)}
      </div>
      <div className="max-w-md mx-auto">
        <button className="w-full py-5 bg-[var(--color-vag-blue)] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all flex items-center justify-center gap-3">
          Subscribe R195/Month <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
