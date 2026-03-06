import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const initialNotifications = [
  { id: '1', timestamp: '14:22:05', message: 'NEW_MESSAGE_RECEIVED from User_01', type: 'success' },
  { id: '2', timestamp: '14:21:59', message: 'PROFILE_UPDATE_SUCCESSFUL', type: 'success' },
  { id: '3', timestamp: '14:20:12', message: 'ALERT: High resource usage on Module_Feed', type: 'warning' },
  { id: '4', timestamp: '14:18:45', message: 'SYSTEM_UPDATE_COMPLETED: v2.1.8', type: 'success' },
  { id: '5', timestamp: '14:17:30', message: 'SECURITY_PATCH_APPLIED: CVE-2024-1337', type: 'system' },
  { id: '6', timestamp: '14:15:01', message: 'Friend request from Cyber_Pilot_X', type: 'success' },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-emerald-400';
    case 'warning':
      return 'text-orange-400';
    case 'system':
      return 'text-cyan-400';
    default:
      return 'text-white/70';
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const clearLogs = () => {
    setNotifications([]);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6">
          <h1 className="font-tech text-2xl text-white tracking-[0.15em] select-none">
            > SYSTEM_LOGS
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearLogs}
            className="flex items-center gap-2 bg-black/[0.3] border border-white/[0.05] rounded-md px-4 py-2 font-mono text-sm text-white/50 hover:text-white/80 hover:border-red-500/50 transition-colors"
          >
            <Trash2 size={14}/>
            Clear Logs
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-black/[0.2] border border-white/[0.05] rounded-md p-4 font-mono text-sm h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 py-1.5"
              >
                <span className="text-white/30">[{notif.timestamp}]</span>
                <span className={`${getTypeColor(notif.type)}`}>{notif.message}</span>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              LOGS CLEARED. AWAITING NEW TRANSMISSIONS...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications; 
