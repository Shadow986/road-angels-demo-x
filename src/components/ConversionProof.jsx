import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ConversionProof() {
  const points = [
    { icon: <AlertTriangle className="text-[var(--color-halo-silver)]" />, title: "Common Failure?", desc: "Most VAG units can be restored if caught early. Avoid the R60k total replacement cost." },
    { icon: <CheckCircle2 className="text-[var(--color-halo-silver)]" />, title: "Dealer-Level Tech", desc: "We utilize ODIS diagnostics and proprietary TCM cloning to ensure factory integrity." },
    { icon: <ShieldCheck className="text-[var(--color-halo-silver)]" />, title: "The Road Angel Bond", desc: "Every restoration is backed by our 12-Month / 30,000km specialized engineering warranty." }
  ];

  return (
    <section className="py-24 bg-white px-8 md:px-20 border-t border-black/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-[var(--color-halo-silver)]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <img 
            src="/terminal-diagnostic.jpg"
            alt="Mechatronic Restoration" 
            className="relative z-10 w-full rounded-2xl hover:grayscale-0 transition-all duration-700 shadow-lg border border-black/10"
          />
          <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-md p-4 border-l-4 border-[var(--color-halo-silver)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-black">Spec: DSG-DQ250-GEN2</p>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase mb-4 tracking-tighter text-black">
              Isolate the Failure. <br />
              <span className="text-[var(--color-halo-silver)]">Save the Gearbox.</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md uppercase tracking-[0.2em]">
              Generalist shops replace entire units. We operate at the board level to restore performance at a fraction of factory costs.
            </p>
          </div>
          <div className="grid gap-8">
            {points.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="mt-1">{p.icon}</div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-black mb-1">{p.title}</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-tighter">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
