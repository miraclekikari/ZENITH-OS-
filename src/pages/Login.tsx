import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Fingerprint } from 'lucide-react';

/**
 * Independent social sign-in button component
 * Each button manages its own loading state to prevent interference
 */
const SocialSignInButton: React.FC<{
  provider: 'google' | 'facebook';
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  hoverClass: string;
}> = ({ provider, label, icon, bgClass, hoverClass }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(`Error during ${provider} OAuth sign-in:`, err.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={isLoading}
      className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${bgClass} ${hoverClass} disabled:opacity-60 disabled:cursor-not-allowed text-white`}
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : icon}
      {isLoading ? 'Connecting...' : label}
    </motion.button>
  );
};

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glass card */}
        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Fingerprint size={28} className="text-black" />
            </div>
            <h1 className="font-tech text-2xl font-bold tracking-[0.2em] text-white">
              {isRegister ? 'CREATE ID' : 'ACCESS CORE'}
            </h1>
            <p className="text-white/25 text-sm mt-2">Secure Gateway v7.0</p>
          </div>

          {/* Social Sign-in Buttons (Independent components) */}
          <div className="flex gap-3 mb-6">
            <SocialSignInButton
              provider="google"
              label="Google"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              }
              bgClass="bg-white/[0.08]"
              hoverClass="hover:bg-white/[0.12]"
            />
            <SocialSignInButton
              provider="facebook"
              label="Facebook"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              }
              bgClass="bg-[#1877F2]/20"
              hoverClass="hover:bg-[#1877F2]/30"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-3 rounded-lg text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="relative group">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'PROCESSING...' : isRegister ? 'CREATE ACCOUNT' : 'AUTHENTICATE'}
            </motion.button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center text-sm">
            <span className="text-white/25">{isRegister ? 'Already have an ID?' : "Don't have an ID?"}</span>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="ml-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
