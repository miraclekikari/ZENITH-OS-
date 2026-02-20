import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
        const { error } = await supabase.auth.signUp(formData);
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword(formData);
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--z-surface)_0%,_var(--z-bg)_100%)] p-4 relative overflow-hidden">
      
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zenith-green rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 animate-fade-in border-zenith-greenDim border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <i className="fas fa-fingerprint text-5xl text-zenith-green mb-4 drop-shadow-[0_0_15px_var(--z-primary)]"></i>
          <h1 className="font-tech text-3xl font-bold tracking-widest text-white">{isRegister ? 'CREATE ID' : 'ACCESS CORE'}</h1>
          <p className="text-zenith-dim text-sm mt-2">Secure Gateway v7.0</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 text-xs p-3 rounded text-center font-bold animate-pulse">
              <i className="fas fa-exclamation-triangle mr-2"></i> {error}
            </div>
          )}

          <div className="relative group">
            <i className="fas fa-envelope absolute left-3 top-3.5 text-zenith-dim group-focus-within:text-zenith-green transition-colors"></i>
            <input 
              type="email" 
              placeholder="Secure Email"
              required
              className="w-full bg-black/50 border border-zenith-greenDim rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zenith-green focus:shadow-[0_0_10px_var(--z-primary-dim)] transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <i className="fas fa-lock absolute left-3 top-3.5 text-zenith-dim group-focus-within:text-zenith-green transition-colors"></i>
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Passphrase"
              required
              className="w-full bg-black/50 border border-zenith-greenDim rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-zenith-green focus:shadow-[0_0_10px_var(--z-primary-dim)] transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <i 
              onClick={() => setShowPass(!showPass)}
              className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 top-3.5 text-zenith-dim cursor-pointer hover:text-white transition-colors`}
            ></i>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full font-bold py-3 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-zenith-green hover:brightness-110 text-black hover:shadow-[0_0_20px_var(--z-primary-dim)]"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
            {loading ? 'PROCESSING...' : (isRegister ? 'REGISTER' : 'AUTHENTICATE')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zenith-dim">{isRegister ? "Already have an ID?" : "Don't have an ID?"}</span>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="ml-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
