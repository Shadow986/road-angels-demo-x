import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function MembershipSection({ navigateTo }) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_active_member')
          .eq('id', user.id)
          .single();
        
        if (data?.is_active_member) {
          setIsActive(true);
        }
      }
    }
    checkStatus();
  }, []);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigateTo('auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('netcash-init', {
        body: { 
          userId: user.id, 
          email: user.email, 
          amount: 195 
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Netcash URL not found");
      }

    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("System Error: Could not reach Netcash. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: "Bronze Badge",
      duration: "4 Months",
      icon: <Trophy className="text-[#cd7f32]" size={24} />,
      benefit: "FREE Full Maintenance",
      description: "Unlocks a free DSG gearbox service including oil, filters, and software updates after 4 months of active status.",
      accent: "border-[#cd7f32]/20"
    },
    {
      name: "Silver Badge",
      duration: "12 Months",
      icon: <Trophy className="text-[#c0c0c0]" size={24} />,
      benefit: "30% Service Discount",
      description: "Massive savings on gearbox services and clutch replacements, plus free maintenance and software updates.",
      accent: "border-[#c0c0c0]/20"
    },
    {
      name: "Gold Badge",
      duration: "24 Months",
      icon: <Trophy className="text-[#ffd700]" size={24} />,
      benefit: "50% Overhaul Discount",
      description: "The ultimate package: Half-price overhauls, roadside assistance, and flexible payment plans for dead units.",
      accent: "border-[#ffd700]/20"
    }
  ];

  return (
    <section className="py-24 bg-[#050505] text-white px-8 md:px-20 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-halo-silver)] text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Loyalty Program
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
              Unlock Exclusive <br /><span className="text-[var(--color-halo-silver)]">Gearbox Care.</span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] leading-relaxed">
              Join the Road Angels RSA subscription for R195/month to secure long-term performance and massive discounts.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('auth')}
            className="px-8 py-4 border border-white/10 hover:border-[var(--color-halo-silver)] transition-all flex items-center gap-4 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Membership Portal</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 bg-[#080808] border ${tier.accent} relative group hover:bg-[#0c0c0c] transition-all duration-500 flex flex-col h-full`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/[0.03] border border-white/5">
                  {tier.icon}
                </div>
                <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest italic">{tier.duration} Goal</span>
              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{tier.name}</h3>
              <div className="text-[var(--color-halo-silver)] text-[10px] font-black uppercase tracking-widest mb-6">
                {tier.benefit}
              </div>

              <p className="text-[11px] text-gray-500 uppercase leading-relaxed tracking-wider mb-8 italic flex-grow">
                "{tier.description}"
              </p>

              <ul className="space-y-3 py-6 border-y border-white/5 mb-8">
                 <li className="flex items-center gap-3 text-[9px] text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-[#2e375f]" /> DSG Gearbox Discounts
                 </li>
                 <li className="flex items-center gap-3 text-[9px] text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-[#2e375f]" /> Software Updates 
                 </li>
                 <li className="flex items-center gap-3 text-[9px] text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-[#2e375f]" /> Roadside Assistance 
                 </li>
              </ul>

              {/* Individual Subscribe Button */}
              <button
                onClick={handleJoin}
                disabled={isActive || loading}
                className={`w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all
                  ${isActive 
                    ? 'bg-green-600/20 text-green-500 border border-green-500/20 cursor-default' 
                    : 'bg-[#2e375f] text-white hover:bg-white hover:text-black'
                  } ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Processing...' : isActive ? '✓ Active' : 'Subscribe R195/m'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}