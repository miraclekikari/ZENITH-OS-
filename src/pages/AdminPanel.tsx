import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB } from '../services/storageService';
import { UserProfile } from '../types';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const u = DB.getUser();
    if (!u || (u.role !== 'ADMIN' && u.role !== 'ROOT')) {
      alert("UNAUTHORIZED ACCESS ATTEMPT DETECTED.");
      navigate('/');
    }
    setUser(u);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="border-b-2 border-red-500 pb-4 mb-8 flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-tech text-red-500 tracking-widest">COMMAND CENTER</h1>
            <p className="text-red-400 font-mono">ROOT ACCESS: {user.username.toUpperCase()} // LEVEL 10</p>
         </div>
         <i className="fas fa-shield-alt text-6xl text-red-500 opacity-20 animate-pulse"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         {['Active Users: 1,240', 'Flagged Content: 5', 'System Load: 12%', 'Storage: 45TB'].map((stat, i) => (
            <div key={i} className="bg-red-900/10 border border-red-500/30 p-4 rounded-xl text-center">
               <div className="text-2xl font-bold text-white mb-1">{stat.split(':')[1]}</div>
               <div className="text-xs text-red-400 uppercase tracking-wider">{stat.split(':')[0]}</div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* User Management */}
         <div className="glass-card border-red-500/30 p-6 rounded-2xl">
            <h3 className="text-xl font-tech text-white mb-4 flex items-center gap-2">
               <i className="fas fa-users text-red-500"></i> User Management
            </h3>
            <div className="space-y-3">
               {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zenith-greenDim">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <div>
                           <div className="text-sm font-bold text-white">User_Delta_{i}</div>
                           <div className="text-[10px] text-gray-400">ID: #892{i}</div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Edit</button>
                        <button className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Ban</button>
                     </div>
                  </div>
               ))}
               <button className="w-full mt-4 bg-red-500 text-black font-bold py-2 rounded hover:bg-red-400">
                  + Add Administrator
               </button>
            </div>
         </div>

         {/* System Logs */}
         <div className="glass-card border-red-500/30 p-6 rounded-2xl font-mono text-xs">
            <h3 className="text-xl font-tech text-white mb-4 flex items-center gap-2">
               <i className="fas fa-terminal text-red-500"></i> System Logs
            </h3>
            <div className="h-64 overflow-y-auto space-y-2 text-gray-400 bg-black/50 p-4 rounded-xl border border-red-900/30">
               <p><span className="text-green-500">[12:00:01]</span> System Init Safe.</p>
               <p><span className="text-yellow-500">[12:05:22]</span> AI Sentinel Blocked Upload #9921 (NSFW).</p>
               <p><span className="text-green-500">[12:10:45]</span> User @root logged in.</p>
               <p><span className="text-blue-500">[12:15:00]</span> Database Backup Complete.</p>
               <p><span className="text-red-500">[12:18:30]</span> Failed Login Attempt (IP: 192.168.x.x)</p>
               <p className="animate-pulse">_</p>
            </div>
         </div>
      </div>
      
      {/* Advanced Parameters */}
      <div className="mt-8">
         <h3 className="text-xl font-tech text-white mb-4">Kernel Parameters</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded border border-zenith-greenDim">
                   <span className="text-xs text-zenith-dim">PARAM_00{i}</span>
                   <div className="w-8 h-4 bg-green-500/20 rounded-full border border-green-500 relative">
                      <div className="absolute right-0 top-0 h-full w-4 bg-green-500 rounded-full"></div>
                   </div>
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
