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
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-black/10 divide-x divide-black/5 rounded-sm shadow-xl overflow-hidden">
          {stats.map((stat, index) => (
            <div key={index} className="p-8 group relative overflow-hidden bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 mb-6 text-gray-400">
                <div className="text-[var(--color-halo-silver)] opacity-70">{stat.icon}</div>
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-mono font-black italic text-black flex items-baseline tracking-tighter mb-4">
                {stat.prefix && <span className="text-sm mr-2 text-gray-400 not-italic uppercase font-bold">{stat.prefix}</span>}
                <Counter value={stat.value} />
                <span className="text-[var(--color-halo-silver)] ml-1">{stat.suffix}</span>
              </div>
              <div className="h-[2px] w-full bg-black/5 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                  className="absolute h-full bg-[var(--color-halo-silver)]" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
