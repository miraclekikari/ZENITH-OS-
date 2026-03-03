import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // The user is automatically authenticated when they land on this page
  // from the password reset link. We just need to capture the new password.

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
    // The user is already authenticated by the session from the URL fragment.
    // We can now update their password.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(`Failed to reset password: ${updateError.message}. Please try requesting a new link.`);
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
        <p className="text-center text-gray-400">You are authenticated. Enter your new password below.</p>
        
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
