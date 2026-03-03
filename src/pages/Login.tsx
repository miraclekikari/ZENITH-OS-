import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, useAnimation } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Fingerprint, Key, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Social Auth Button Component
const SocialButton: React.FC<{ provider: 'google' | 'github', onError: (msg: string) => void }> = ({ provider, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const icons = {
    google: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
    github: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  };
  const bgClasses = {
    google: 'bg-white/[0.08] hover:bg-white/[0.12]',
    github: 'bg-neutral-800 hover:bg-neutral-700'
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}` } });
      if (error) throw error;
    } catch (err: any) {
      onError(err.error_description || err.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={handleLogin} disabled={isLoading}
      className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${bgClasses[provider]} disabled:opacity-60 disabled:cursor-not-allowed text-white`}>
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : icons[provider]}
      {isLoading ? 'Redirecting...' : provider.charAt(0).toUpperCase() + provider.slice(1)}
    </motion.button>
  );
};

// --- Main Login Component ---
const Login: React.FC = () => {
  const [authView, setAuthView] = useState('sign-in');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const animationControls = useAnimation();

  const getAuthErrorMessage = (err: any): string => {
    const message = err.message || '';
    if (message.includes('Email not confirmed')) {
      return 'ACCESS DENIED: Email verification pending';
    }
    if (message.includes('Invalid login credentials')) {
      return 'ACCESS DENIED: Unknown ID or incorrect password';
    }
    return err.error_description || message;
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      let responseError;
      if (authView === 'sign-up') {
        const { error } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
        if (!error) {
          navigate('/feed', { state: { message: 'Welcome to ZENITH! Your journey begins now.' } });
        } else { responseError = error; }
      } else if (authView === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
        responseError = error;
      } else if (authView === 'magic-link') {
        const { error } = await supabase.auth.signInWithOtp({ email: formData.email, options: { emailRedirectTo: `${window.location.origin}` }});
        if (!error) setInfo(`Magic Link sent to ${formData.email}. Check your inbox!`)
        responseError = error;
      } else if (authView === 'forgot-password') {
         const { error } = await supabase.auth.resetPasswordForEmail(formData.email, { redirectTo: `${window.location.origin}/reset-password` });
         if (!error) setInfo(`Password reset link sent to ${formData.email}.`);
         responseError = error;
      }
      if (responseError) throw responseError;
    } catch (err: any) {
      animationControls.start({ x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } });
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  
  const switchView = (view: string) => {
    setAuthView(view);
    setError('');
    setInfo('');
    setShowPass(false);
    setFormData({ email: '', password: '' });
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
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
        <motion.div 
          animate={animationControls}
          className="bg-[#111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Fingerprint size={28} className="text-black" />
            </div>
            <h1 className="font-tech text-2xl font-bold tracking-[0.2em] text-white">
              {{ 'sign-in': 'ACCESS CORE', 'sign-up': 'CREATE ID', 'magic-link': 'BEAM ACCESS', 'forgot-password': 'RECOVER ID' }[authView]}
            </h1>
            <p className="text-white/25 text-sm mt-2">Secure Gateway v7.2</p>
          </div>

          {error && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wider p-3 rounded-lg text-center mb-4">{error}</motion.div>}
          {info && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-3 rounded-lg text-center font-medium mb-4">{info}</motion.div>}

          {authView === 'sign-in' || authView === 'sign-up' ? (
            <>
              <div className="flex gap-3 mb-4">
                <SocialButton provider="google" onError={setError} />
                <SocialButton provider="github" onError={setError} />
              </div>
              <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-white/[0.06]" /><span className="text-white/20 text-xs font-medium">OR</span><div className="flex-1 h-px bg-white/[0.06]" /></div>
            </>
          ) : null}

          <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="relative group">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
              <input type="email" placeholder="Email address" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            {authView === 'sign-in' || authView === 'sign-up' ? (
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
            ) : null}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'PROCESSING...' : {'sign-in':'AUTHENTICATE','sign-up':'CREATE ACCOUNT', 'magic-link':'SEND MAGIC LINK', 'forgot-password':'SEND RESET LINK'}[authView]}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm space-y-3">
             {authView === 'sign-in' && <button onClick={() => switchView('forgot-password')} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors text-xs flex items-center justify-center gap-1 w-full"><Key size={12} /> Forgot Password?</button>}
             {authView !== 'sign-in' && <span className="text-white/40">Remember your password? <button onClick={() => switchView('sign-in')} className="ml-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">Sign In</button></span>}
             {authView === 'sign-in' && <span className="text-white/40">Don't have an ID? <button onClick={() => switchView('sign-up')} className="ml-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">Sign Up</button></span>}
             {(authView === 'sign-in' || authView === 'sign-up') && <button onClick={() => switchView('magic-link')} className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors text-xs flex items-center justify-center gap-1.5 w-full pt-2 border-t border-white/10"><Zap size={12}/> Or use a passwordless Magic Link</button>}
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
