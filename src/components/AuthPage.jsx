import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div className="space-y-2 text-left">
    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={onChange}
      required
      className="w-full bg-white/[0.02] border border-white/10 p-4 text-[13px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-800" 
      placeholder={placeholder} 
    />
  </div>
);

export default function AuthPage({ onBack, onLoginSuccess }) {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
        if (error) throw error;
        onLoginSuccess();
      } else if (view === "register") {
        const { error } = await supabase.auth.signUp({ 
          email: formData.email, 
          password: formData.password,
          options: { data: { full_name: formData.fullName } }
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
        setView("login");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center px-6 py-20 font-sans relative">
      
      {/* TOP LEFT BRANDING & BACK BUTTON */}
      <div className="absolute top-10 left-10 flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </button>
        <div className="flex items-center gap-3 opacity-30 select-none">
           <img src="/Logo.png" alt="" className="w-6 h-6 grayscale" />
           <span className="text-[10px] font-black italic tracking-tighter text-white">
             ROAD <span className="text-[var(--color-halo-silver)]">ANGELS</span>
           </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-white/5 bg-white/[0.02] rounded-full mb-8 text-[var(--color-halo-silver)] shadow-2xl">
            <ShieldCheck size={36} strokeWidth={1} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            {view === "login" ? "Welcome Back" : view === "register" ? "Join Program" : "Reset Access"}
          </h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600 font-bold">Secure Member Portal</p>
        </div>

        <div className="bg-white/[0.01] border border-white/5 p-10 rounded-sm">
          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.form key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleAuth}>
                <InputField label="Email Address" type="email" placeholder="member@roadangelsrsa.co.za" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Password</label>
                    <button type="button" onClick={() => setView("forgot")} className="text-[8px] uppercase text-gray-700 hover:text-white transition-colors font-bold">Forgot Access?</button>
                  </div>
                  <input type="password" required className="w-full bg-white/[0.02] border border-white/10 p-4 text-[13px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-800" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : "Authorize Sign In"} <ChevronRight size={14} />
                </button>
                <p className="text-center text-[9px] text-gray-600 uppercase tracking-widest font-bold pt-6 border-t border-white/5">
                  New Member? <button type="button" onClick={() => setView("register")} className="text-white hover:text-[var(--color-halo-silver)] ml-2">Register Now</button>
                </p>
              </motion.form>
            )}

            {view === "register" && (
              <motion.form key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleAuth}>
                <InputField label="Full Name" type="text" placeholder="Driver Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                <InputField label="Email Address" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <InputField label="Password" type="password" placeholder="Create Access Key" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : "Create Account"} <ChevronRight size={14} />
                </button>
                <p className="text-center text-[9px] text-gray-600 uppercase tracking-widest font-bold pt-6 border-t border-white/5">
                  Already Registered? <button type="button" onClick={() => setView("login")} className="text-white hover:text-[var(--color-halo-silver)] ml-2">Sign In Here</button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}