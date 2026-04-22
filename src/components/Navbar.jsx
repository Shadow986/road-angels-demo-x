import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, X, ChevronDown, FileText } from "lucide-react";

export default function Navbar({ setPage, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (id) => { setPage(id); setIsMobileMenuOpen(false); };

  const policies = [
    { name: 'Terms & Conditions', link: '/assets/Road_Angels_RSA_Terms_and_Conditions.pdf' },
    { name: 'Refund Policy', link: '/assets/Road_Angels_RSA_Refund_Policy.pdf' }
  ];

  const links = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Membership', id: 'membership' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-[100] px-6 md:px-20 py-5 flex justify-between items-center transition-all duration-500 border-b ${
          scrolled || isMobileMenuOpen ? "bg-white/95 backdrop-blur-2xl border-black/10 shadow-sm" : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center gap-4 cursor-pointer z-[110]" onClick={() => handleNavigate('home')}>
          <img src="/Logo.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <div className="flex flex-col">
            <div className="text-[14px] md:text-[18px] tracking-[0.2em] font-black italic text-black leading-none uppercase">
              ROAD <span className="text-[var(--color-halo-silver)]">ANGELS</span>
            </div>
            <div className="text-[8px] md:text-[10px] tracking-[0.4em] font-bold text-gray-400 uppercase mt-1">
              DSG SPECIALISTS
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[12px] uppercase tracking-[0.2em] font-bold">
          {links.map((link) => (
            <button 
              key={link.id} 
              onClick={() => handleNavigate(link.id)} 
              className={`transition-colors ${currentPage === link.id ? 'text-[var(--color-halo-silver)]' : 'text-gray-400 hover:text-black'}`}
            >
              {link.label}
            </button>
          ))}
          <div className="relative group py-2">
            <button className="flex items-center gap-2 text-gray-400 group-hover:text-black transition-colors uppercase" onClick={(e) => e.stopPropagation()}>
              Policies <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full right-0 w-64 bg-white border border-black/10 hidden group-hover:block py-3 shadow-xl">
              {policies.map((p) => (
                <a 
                  key={p.name} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-[10px] text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
                >
                  <FileText size={14} className="text-[var(--color-halo-silver)]" />
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 lg:hidden z-[110]">
          <button onClick={() => handleNavigate('auth')} className="text-gray-400 hover:text-black">
            <User size={24} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            className="fixed inset-0 z-[90] bg-white pt-32 px-10 flex flex-col gap-8"
          >
            {links.map((link) => (
              <button 
                key={link.id} 
                onClick={() => handleNavigate(link.id)} 
                className={`text-3xl font-black uppercase text-left tracking-tighter italic ${currentPage === link.id ? 'text-[var(--color-halo-silver)]' : 'text-black/40 hover:text-black'}`}
              >
                {link.label}
              </button>
            ))}
            <div className="h-px bg-black/10 my-4" />
            <p className="text-[12px] text-gray-400 uppercase tracking-[0.4em] font-bold">Legal & Documentation</p>
            <div className="flex flex-col gap-6">
              {policies.map((p) => (
                <a 
                  key={p.name} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-xl font-bold text-black/60 uppercase italic hover:text-black"
                >
                  <FileText size={22} className="text-[var(--color-halo-silver)]" /> 
                  {p.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
