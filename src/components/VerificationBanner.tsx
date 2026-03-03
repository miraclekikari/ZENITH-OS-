import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { AlertTriangle, Send, CheckCircle, X } from 'lucide-react';

interface VerificationBannerProps {
  isConfirmed: boolean;
}

const VerificationBanner: React.FC<VerificationBannerProps> = ({ isConfirmed }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleResend = async () => {
    setIsSending(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');
      
      const { error } = await supabase.auth.resend({ 
        type: 'signup',
        email: user.email! 
      });

      if (error) throw error;
      setIsSent(true);
      setTimeout(() => setIsVisible(false), 5000); // Hide banner after 5s on success
    } catch (err: any) {
      console.error("Error resending verification email:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  if (isConfirmed || !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
      className="fixed top-0 left-0 right-0 z-[1000] p-3 flex items-center justify-center bg-yellow-500/20 backdrop-blur-md border-b border-yellow-500/30"
    >
      <div className="flex items-center gap-3 text-yellow-200 text-sm font-medium">
        <AlertTriangle size={18} />
        {isSent ? (
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle size={18}/>
            <span>Verification email sent successfully! Check your inbox.</span>
          </div>
        ) : (
          <p>Your account is in limited mode. Please verify your email to unlock all features.</p>
        )}
      </div>
      {!isSent && (
        <button
          onClick={handleResend}
          disabled={isSending}
          className="ml-4 px-4 py-1.5 text-xs font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
        >
          {isSending ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Send size={14}/></motion.div> : <Send size={14}/>}
          {isSending ? 'Sending...' : 'Resend Verification Email'}
        </button>
      )}
       {error && <p className='text-xs text-red-400 ml-4'>{error}</p>}
       <button onClick={() => setIsVisible(false)} className="absolute top-2 right-3 text-yellow-200/50 hover:text-yellow-200">
           <X size={16}/>
       </button>
    </motion.div>
  );
};

export default VerificationBanner;
