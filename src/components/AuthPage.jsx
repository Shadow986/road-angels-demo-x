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
      className="w-full bg-gray-50 border border-black/10 p-4 text-[13px] text-black focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-400" 
      placeholder={placeholder} 
    />
  </div>
);

export default function AuthPage({ onBack, onLoginSuccess }) {
  const [view, setView] = useState("login"); // login | register | forgot | register-done | forgot-done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });

  const updateField = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
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
        setView("register-done");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("invalid login credentials") || msg.toLowerCase().includes("invalid credentials")) {
        setError("Invalid email or password. If you just registered, please confirm your email first before signing in.");
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setView("forgot-done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (v) => {
    setView(v);
    setError("");
    setFormData({ email: "", password: "", fullName: "" });
  };

  const titles = {
    login: "Welcome Back",
    register: "Join Program",
    forgot: "Reset Access",
    "register-done": "Check Your Email",
    "forgot-done": "Reset Link Sent",
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-6 py-20 font-sans relative">
      <div className="absolute top-10 left-10 flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </button>
        <div className="flex items-center gap-3 opacity-40 select-none">
           <img src="/Logo.png" alt="" className="w-6 h-6" />
           <span className="text-[10px] font-black italic tracking-tighter text-black">
             ROAD <span className="text-[var(--color-halo-silver)]">ANGELS</span>
           </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-black/10 bg-gray-50 rounded-full mb-8 text-[var(--color-halo-silver)] shadow-lg">
            <ShieldCheck size={36} strokeWidth={1} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black mb-2 leading-none">
            {titles[view]}
          </h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Secure Member Portal</p>
        </div>

        <div className="bg-gray-50 border border-black/10 p-10 rounded-sm">
          <AnimatePresence mode="wait">

            {/* ── LOGIN ── */}
            {view === "login" && (
              <motion.form key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleAuth}>
                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide bg-red-50 border border-red-200 p-3">{error}</p>}
                <InputField label="Email Address" type="email" placeholder="member@roadangelsrsa.co.za" value={formData.email} onChange={updateField("email")} />
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Password</label>
                    <button type="button" onClick={() => switchView("forgot")} className="text-[8px] uppercase text-gray-400 hover:text-black transition-colors font-bold">Forgot Access?</button>
                  </div>
                  <input type="password" required className="w-full bg-gray-50 border border-black/10 p-4 text-[13px] text-black focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-400" placeholder="••••••••" value={formData.password} onChange={updateField("password")} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : "Authorize Sign In"} {!loading && <ChevronRight size={14} />}
                </button>
                <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest font-bold pt-6 border-t border-black/5">
                  New Member? <button type="button" onClick={() => switchView("register")} className="text-black hover:text-[var(--color-halo-silver)] ml-2">Register Now</button>
                </p>
              </motion.form>
            )}

            {/* ── REGISTER ── */}
            {view === "register" && (
              <motion.form key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleAuth}>
                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide bg-red-50 border border-red-200 p-3">{error}</p>}
                <InputField label="Full Name" type="text" placeholder="Driver Name" value={formData.fullName} onChange={updateField("fullName")} />
                <InputField label="Email Address" type="email" placeholder="email@example.com" value={formData.email} onChange={updateField("email")} />
                <InputField label="Password" type="password" placeholder="Create Access Key (min 8 chars)" value={formData.password} onChange={updateField("password")} />
                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : "Create Account"} {!loading && <ChevronRight size={14} />}
                </button>
                <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest font-bold pt-6 border-t border-black/5">
                  Already Registered? <button type="button" onClick={() => switchView("login")} className="text-black hover:text-[var(--color-halo-silver)] ml-2">Sign In Here</button>
                </p>
              </motion.form>
            )}

            {/* ── REGISTER SUCCESS ── */}
            {view === "register-done" && (
              <motion.div key="register-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-500 text-2xl">✓</div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                    Account created! A confirmation link has been sent to <span className="text-black font-bold">{formData.email}</span>. Please check your inbox (and spam folder) and click the link to activate your account.
                  </p>
                </div>
                <button onClick={() => switchView("login")} className="w-full py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[var(--color-halo-silver)] transition-all flex items-center justify-center gap-3">
                  Go to Sign In <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {view === "forgot" && (
              <motion.form key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={handleForgot}>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Enter your email and we'll send you a reset link.</p>
                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide bg-red-50 border border-red-200 p-3">{error}</p>}
                <InputField label="Email Address" type="email" placeholder="member@roadangelsrsa.co.za" value={formData.email} onChange={updateField("email")} />
                <button type="submit" disabled={loading} className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : "Send Reset Link"} {!loading && <ChevronRight size={14} />}
                </button>
                <button type="button" onClick={() => switchView("login")} className="w-full text-center text-[9px] text-gray-400 uppercase tracking-widest font-bold hover:text-black transition-colors">
                  ← Back to Sign In
                </button>
              </motion.form>
            )}

            {/* ── FORGOT SUCCESS ── */}
            {view === "forgot-done" && (
              <motion.div key="forgot-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-500 text-2xl">✉</div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                  A password reset link has been sent to <span className="text-black font-bold">{formData.email}</span>. Check your inbox and spam folder.
                </p>
                <button onClick={() => switchView("login")} className="w-full py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[var(--color-halo-silver)] transition-all flex items-center justify-center gap-3">
                  Back to Sign In <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
