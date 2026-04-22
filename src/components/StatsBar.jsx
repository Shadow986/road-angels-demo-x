import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ShieldCheck, Wrench, Users, Zap } from "lucide-react";

const Counter = ({ value, duration = 2 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "circOut" });
    return controls.stop;
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
};

export default function StatsBar() {
  const stats = [
    { label: "Engineers", value: 15, suffix: "+", icon: <Wrench size={12} /> },
    { label: "Restorations", value: 1200, suffix: "+", icon: <Zap size={12} /> },
    { label: "VAG Members", value: 450, suffix: "+", icon: <Users size={12} /> },
    { label: "Security", value: 1, prefix: "Tier ", icon: <ShieldCheck size={12} /> },
  ];

  return (
    <div className="relative z-30 -mt-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#080808] border border-white/5 divide-x divide-white/5 rounded-sm shadow-2xl overflow-hidden">
          {stats.map((stat, index) => (
            <div key={index} className="p-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
              <div className="flex items-center gap-2 mb-6 text-gray-500">
                <div className="text-[var(--color-halo-silver)] opacity-50">{stat.icon}</div>
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-mono font-black italic text-white flex items-baseline tracking-tighter mb-4">
                {stat.prefix && <span className="text-sm mr-2 text-gray-600 not-italic uppercase font-bold">{stat.prefix}</span>}
                <Counter value={stat.value} />
                <span className="text-[var(--color-halo-silver)] ml-1">{stat.suffix}</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                  className="absolute h-full bg-[var(--color-halo-silver)] shadow-[0_0_10px_var(--color-halo-silver)]" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}