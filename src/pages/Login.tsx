import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, useAnimation } from 'framer-motion';
import { AtSign, User, Lock, Eye, EyeOff, Loader2, Fingerprint, Key, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialButton: React.FC<{ provider: 'google' | 'github', onError: (msg: string) => void }> = ({ provider, onError }) => {
  // ... (code inchangé)
};

const maskEmail = (email: string) => {
  const [localPart, domain] = email.split('@');
  const [domainName, topLevelDomain] = domain.split('.');
  return `${localPart.substring(0, 2)}***@${domainName.substring(0, 1)}***.${topLevelDomain}`;
};

const Login: React.FC = () => {
  const [authView, setAuthView] = useState('sign-in');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('AUTHENTICATE');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [formData, setFormData] = useState({ identifier: '', password: '', email: '' });
  const navigate = useNavigate();
  const animationControls = useAnimation();

  const getAuthErrorMessage = (err: any): string => {
    const message = err.message || '';
    if (message.includes('Email not confirmed')) return 'ACCESS DENIED: Email verification pending';
    if (message.includes('Invalid login credentials')) return 'ACCESS DENIED: Unknown ID or incorrect password';
    return err.error_description || message;
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');
    animationControls.start({ x: 0 });

    try {
      let responseError;
      
      if (authView === 'sign-in') {
        let authEmail = '';
        if (formData.identifier.includes('@')) {
          authEmail = formData.identifier;
        } else {
          setLoadingText('VERIFYING ID...');
          const { data, error: rpcError } = await supabase.rpc('get_email_from_username', { p_username: formData.identifier });

          if (rpcError || !data) {
            throw new Error('ACCESS DENIED: Unknown Identity');
          }
          
          authEmail = data;
          const masked = maskEmail(authEmail);
          setInfo(`ID VERIFIED: ${masked}`);
          setLoadingText('ID VERIFIED');
          await new Promise(resolve => setTimeout(resolve, 1500)); // Pause pour l'immersion
        }

        setLoadingText('AUTHENTICATING...');
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: formData.password });
         if (!error) {
          navigate('/feed');
        } else {
          responseError = error;
        }

      } else if (authView === 'sign-up') {
        setLoadingText('CREATING ID...');
        const { error } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
        if (!error) {
          navigate('/feed', { state: { message: 'Welcome to ZENITH! Your journey begins now.' } });
        } else { responseError = error; }
      } else {
        // Logique pour magic-link et forgot-password
        const emailToUse = isEmailView ? formData.email : formData.identifier;
        if (!emailToUse) { throw new Error('Email is required.') }

        if (authView === 'magic-link') {
          setLoadingText('SENDING LINK...');
          const { error } = await supabase.auth.signInWithOtp({ email: emailToUse, options: { emailRedirectTo: `${window.location.origin}` }});
          if (!error) setInfo(`Magic Link sent to ${emailToUse}. Check your inbox!`);
          responseError = error;
        } else if (authView === 'forgot-password') {
          setLoadingText('SENDING RESET...');
          const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, { redirectTo: `${window.location.origin}/reset-password` });
          if (!error) setInfo(`Password reset link sent to ${emailToUse}.`);
          responseError = error;
        }
      }

      if (responseError) throw responseError;

    } catch (err: any) {
      animationControls.start({ x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } });
      setError(err.message === 'ACCESS DENIED: Unknown Identity' ? err.message : getAuthErrorMessage(err));
    } finally {
      setLoading(false);
      setLoadingText('AUTHENTICATE');
    }
  };
  
  const switchView = (view: string) => {
    setAuthView(view);
    setError('');
    setInfo('');
    setShowPass(false);
    setFormData({ identifier: '', password: '', email: '' });
  }

  const isEmailView = authView === 'sign-up' || authView === 'magic-link' || authView === 'forgot-password';

  // ... (le reste du JSX)

return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" /><div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[100px]" /></div>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-md relative z-10">
        <motion.div animate={animationControls} className="bg-[#111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"><Fingerprint size={28} className="text-black" /></div>
            <h1 className="font-tech text-2xl font-bold tracking-[0.2em] text-white">{{ 'sign-in': 'ACCESS CORE', 'sign-up': 'CREATE ID', 'magic-link': 'BEAM ACCESS', 'forgot-password': 'RECOVER ID' }[authView]}</h1>
            <p className="text-white/25 text-sm mt-2">Secure Gateway v7.6</p>
          </div>

          {error && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wider p-3 rounded-lg text-center mb-4">{error}</motion.div>}
          {info && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-3 rounded-lg text-center font-medium mb-4 flex items-center justify-center gap-2"><CheckCircle size={14}/> {info}</motion.div>}

          {(authView === 'sign-in' || authView === 'sign-up') && <div className="flex gap-3 mb-4"><SocialButton provider="google" onError={setError} /><SocialButton provider="github" onError={setError} /></div>}
          {(authView === 'sign-in' || authView === 'sign-up') && <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-white/[0.06]" /><span className="text-white/20 text-xs font-medium">OR</span><div className="flex-1 h-px bg-white/[0.06]" /></div>}

          <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="relative group">
              { isEmailView || (authView === 'sign-in' && formData.identifier.includes('@')) ? <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" /> : <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />}
              <input 
                type={isEmailView ? "email" : "text"}
                placeholder={isEmailView ? "Email address" : "Email or Username"}
                required 
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
                value={isEmailView ? formData.email : formData.identifier}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isEmailView) {
                    setFormData({ ...formData, email: value });
                  } else {
                    setFormData({ ...formData, identifier: value });
                  }
                }}
              />
            </div>

            {(authView === 'sign-in' || authView === 'sign-up') && (
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
            )}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? loadingText : { 'sign-in': 'AUTHENTICATE', 'sign-up': 'CREATE ACCOUNT', 'magic-link': 'SEND MAGIC LINK', 'forgot-password': 'SEND RESET LINK' }[authView]}
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
}

export default Login;
