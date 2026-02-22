import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, User, MessageSquare } from 'lucide-react';
import { formatAvatar } from '../utils/avatar';

interface Notification {
  id: string;
  type: 'new_follower' | 'new_message' | 'system';
  text: string;
  relatedUser?: {
    username: string;
    avatar_url: string;
  };
  createdAt: string;
}

// MOCK DATA
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_follower',
    text: 'started following you.',
    relatedUser: { username: 'elon', avatar_url: '' },
    createdAt: '5m ago'
  },
  {
    id: '2',
    type: 'new_message',
    text: 'sent you a message: "Wanna build a rocket?"'',
    relatedUser: { username: 'gwynne', avatar_url: '' },
    createdAt: '30m ago'
  },
  {
    id: '3',
    type: 'system',
    text: 'Your account verification is complete.',
    createdAt: '1h ago'
  },
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
    const getIcon = (type: Notification['type']) => {
        switch(type) {
            case 'new_follower': return <User className="w-4 h-4 text-cyan-400" />;
            case 'new_message': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
            default: return <Bell className="w-4 h-4 text-white/50" />;
        }
    }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/[0.08] shadow-2xl z-[200] flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b border-white/[0.08] flex-shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2"><Bell size={18}/> Notifications</h2>
              <button onClick={onClose} className="p-1 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </header>

            <div className="flex-grow overflow-y-auto">
              {mockNotifications.length > 0 ? (
                <ul>
                  {mockNotifications.map((notif) => (
                    <li key={notif.id} className="border-b border-white/[0.05] p-4 flex gap-3 hover:bg-white/[0.03] transition-colors">
                      <div className="w-10 h-10 flex-shrink-0 mt-1">
                        {notif.relatedUser ? (
                          <img src={formatAvatar(notif.relatedUser.avatar_url, notif.relatedUser.username)} alt={notif.relatedUser.username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-white/[0.05] flex items-center justify-center">{getIcon(notif.type)}</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          {notif.relatedUser && <span className="font-bold">@{notif.relatedUser.username}</span>} {notif.text}
                        </p>
                        <span className="text-xs text-white/40 mt-1">{notif.createdAt}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-20">
                  <Bell size={40} className="mx-auto text-white/20 mb-4"/>
                  <h3 className="font-semibold text-white/80">No new notifications</h3>
                  <p className="text-sm text-white/40">You're all caught up.</p>
                </div>
              )}
            </div>

             <footer className="p-4 border-t border-white/[0.08] flex-shrink-0 text-center">
                <button className="text-xs text-cyan-400 hover:underline">
                    Mark all as read
                </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
