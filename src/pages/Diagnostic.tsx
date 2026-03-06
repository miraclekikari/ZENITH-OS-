import React from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

const Diagnostic: React.FC = () => {
  const { session, user, profile, loading, isAdmin } = useUser();

  // Check Supabase connection status based on the session.
  const isSupabaseConnected = !!session;

  const renderObject = (title: string, data: object | null | undefined) => (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold text-zenith-primary mb-2">{title}</h2>
      <pre className="text-sm text-white whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2) || 'null'}
      </pre>
    </div>
  );

  return (
    <div className="p-4 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">ZENITH OS - Diagnostic Terminal</h1>
      
      <div className="space-y-3 mb-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isSupabaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p><strong>Supabase Connection:</strong> {isSupabaseConnected ? <span className='text-green-400'>ACTIVE</span> : <span className='text-red-400'>INACTIVE / NO SESSION</span>}</p>
        </div>
        <p><strong>User Role:</strong> {isAdmin ? <span className='text-yellow-400'>ADMIN</span> : 'USER'}</p>
        <p><strong>Context Loading State:</strong> {loading ? 'Fetching data...' : 'Idle'}</p>
      </div>

      {renderObject('Session (Access Badge)', session)}
      {renderObject('User (Raw Identity)', user)}
      {renderObject('Profile (User Dossier)', profile)}

    </div>
  );
};

export default Diagnostic;
