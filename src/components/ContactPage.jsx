import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const ContactMethod = ({ icon: Icon, title, value, href }) => (
  <a 
    href={href} 
    className="flex items-start gap-6 p-8 bg-white/[0.02] border border-white/5 hover:border-[var(--color-halo-silver)]/30 transition-all duration-500 group"
  >
    <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-halo-silver)]/10 border border-[var(--color-halo-silver)]/20 text-[var(--color-halo-silver)] group-hover:bg-[var(--color-halo-silver)] group-hover:text-white transition-all">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 group-hover:text-white transition-colors">{title}</h4>
      <p className="text-[12px] font-bold uppercase tracking-widest text-white">{value}</p>
    </div>
  </a>
);

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 px-8 md:px-20 font-sans selection:bg-[var(--color-halo-silver)]">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="inline-block px-3 py-1 bg-[var(--color-halo-silver)] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-bold">
          Technical Support
        </div>
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white mb-8">
          Secure <br /><span className="text-[var(--color-halo-silver)]">Contact.</span>
        </h1>
        <p className="max-w-xl text-[11px] text-gray-500 uppercase tracking-[0.3em] leading-loose font-bold">
          Our senior engineers are available for specialized mechatronic consultation. Secure a diagnostic slot via the terminal below.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        
        {/* LEFT: THE INTAKE TERMINAL (FORM) */}
        <div className="bg-white/[0.02] border border-white/5 p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MessageSquare size={120} strokeWidth={1} />
          </div>

          <form className="relative z-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Full Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-[12px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-colors uppercase font-bold tracking-widest" placeholder="e.g. MARCUS KRUGER" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Contact Number</label>
                <input type="tel" className="w-full bg-transparent border-b border-white/10 py-3 text-[12px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-colors uppercase font-bold tracking-widest" placeholder="+27" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Vehicle Model</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-[12px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-colors uppercase font-bold tracking-widest" placeholder="e.g. GOLF 7R / AUDI S3" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Transmission Type</label>
                <select className="w-full bg-transparent border-b border-white/10 py-3 text-[12px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-colors uppercase font-bold tracking-widest appearance-none">
                  <option className="bg-[#080808]">DSG (6-SPEED / 7-SPEED)</option>
                  <option className="bg-[#080808]">S-TRONIC</option>
                  <option className="bg-[#080808]">PDK</option>
                  <option className="bg-[#080808]">MULTITRONIC</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Describe Technical Issue</label>
              <textarea rows="4" className="w-full bg-transparent border border-white/10 p-4 text-[12px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-colors uppercase font-bold tracking-widest leading-relaxed" placeholder="e.g. REVERSE GEAR ENGAGEMENT DELAY..."></textarea>
            </div>

            <button className="w-full py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[var(--color-halo-silver)] hover:text-white transition-all flex items-center justify-center gap-3 group">
              Transmit Data <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* RIGHT: CONTACT DETAILS & MAP */}
        <div className="space-y-12">
          <div className="grid sm:grid-cols-1 gap-px bg-white/5 border border-white/5">
            <ContactMethod 
              icon={Phone} 
              title="Hotline" 
              value="+27 60 480 7393" 
              href="tel:+27604807393" 
            />
            <ContactMethod 
              icon={Mail} 
              title="Email" 
              value="INFO@ROADANGELSRSA.CO.ZA" 
              href="mailto:info@roadangelsrsa.co.za" 
            />
            <ContactMethod 
              icon={MapPin} 
              title="Engineering Hub" 
              value="35 TALJAARD STREET, BENONI" 
              href="https://maps.google.com" 
            />
          </div>

          <div className="p-10 border border-white/5 flex flex-col justify-between items-start gap-8 bg-gradient-to-br from-white/[0.01] to-transparent">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-4">Availability Window</h4>
              <div className="space-y-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <div className="flex justify-between w-64 border-b border-white/5 pb-2">
                  <span>Mon — Fri</span>
                  <span className="text-white">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between w-64 border-b border-white/5 pb-2">
                  <span>Saturday</span>
                  <span className="text-white">08:00 - 13:00</span>
                </div>
                <div className="flex justify-between w-64">
                  <span>Emergency</span>
                  <span className="text-[var(--color-halo-silver)]">24 / 7</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-3 px-6 bg-[var(--color-halo-silver)]/10 border border-[var(--color-halo-silver)]/20 rounded-full">
              <ShieldCheck size={14} className="text-[var(--color-halo-silver)]" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">RMI Approved Facility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}