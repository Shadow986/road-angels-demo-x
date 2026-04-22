import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, CheckCircle, Zap } from "lucide-react";

const Badge = ({ title, subtitle, icon: Icon }) => (
  <div className="flex flex-col items-center text-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 border border-transparent hover:border-black/5 bg-transparent hover:bg-gray-50">
    <div className="mb-4 text-black transition-colors">
      <Icon size={32} strokeWidth={1} />
    </div>
    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-1">{title}</h4>
    <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">{subtitle}</p>
  </div>
);

export default function TrustBadges() {
  return (
    <div className="py-16 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <Badge icon={ShieldCheck} title="RMI Accredited" subtitle="Retail Motor Industry" />
          <Badge icon={Award} title="VAG Certified" subtitle="Specialist Engineering" />
          <Badge icon={CheckCircle} title="SABS Approved" subtitle="Quality Standards" />
          <Badge icon={Zap} title="MIWA Member" subtitle="Workshop Association" />
        </div>
        <div className="mt-12 text-center">
          <p className="text-[8px] text-gray-400 uppercase tracking-[0.5em] font-bold">
            All engineering procedures strictly adhere to OEM technical bulletins.
          </p>
        </div>
      </div>
    </div>
  );
}
