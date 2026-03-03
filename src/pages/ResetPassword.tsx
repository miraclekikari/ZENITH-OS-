import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleReset = async () => {
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });

      if (error) {
        setError('Error parsing reset token from URL: ' + error.message);
      } else if (!data.session) {
        setError('Password reset link is invalid or has expired. Please request a new one.');
      }
    };
    
    if (window.location.hash.includes('access_token')) {
        handleReset();
    }
  }, []);


  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(`Failed to reset password: ${updateError.message}`);
    } else {
      setMessage("Your password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-zenith-primary">Reset Your Password</h2>
        
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zenith-primary"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zenith-primary"
              placeholder="Confirm new password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-zenith-primary rounded-md hover:bg-zenith-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zenith-primary disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-sm text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
