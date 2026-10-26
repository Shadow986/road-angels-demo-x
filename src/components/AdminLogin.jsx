import React, { useState } from 'react';
import { ShieldAlert, Loader2, ArrowLeft, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Supabase auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Access denied. This account does not have admin privileges.');
        setLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-20 font-sans relative">
      <div className="absolute top-10 left-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-white/10 bg-white/5 rounded-full mb-8 text-[var(--color-halo-silver)] shadow-lg">
            <ShieldAlert size={36} strokeWidth={1} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            Secure <span className="text-[var(--color-halo-silver)]">Terminal</span>
          </h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Authorized Personnel Only</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-sm backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-[10px] font-bold uppercase tracking-wide bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Mail size={12} /> Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 p-4 text-[13px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-600"
                placeholder="admin@roadangelsrsa.co.za"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Lock size={12} /> Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 p-4 text-[13px] text-white focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-600"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'Authorize Access'}
            </button>
          </form>
        </div>

        <p className="text-center text-[8px] text-gray-600 uppercase tracking-[0.3em] font-bold mt-8">
          Road Angels RSA · Admin Console
        </p>
      </div>
    </div>
  );
}
