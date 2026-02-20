import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCheck, faTrash, faComment, faUserPlus, faAt, faRepeat, faEnvelope, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import notificationService, { NotificationType } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { getUser } from '../services/storageService';
import useNotificationSound from '../hooks/useNotificationSound';

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();

  const { playSound } = useNotificationSound({ volume: 0.4, enabled: true });

  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications();
    fetchUnreadCount();

    notificationService.subscribeToNotifications(
      (newNotification) => {
        playSound();
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        if (window.Notification.permission === 'granted') {
          new window.Notification('ZENITH OS', {
            body: newNotification.message,
            icon: newNotification.actor_avatar || '/favicon.ico',
          });
        }
      },
      () => fetchUnreadCount()
    );

    if (window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }

    return () => notificationService.unsubscribe();
  }, [currentUser, playSound]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const data = await notificationService.fetchNotifications(30);
    setNotifications(data);
    setIsLoading(false);
  };

  const fetchUnreadCount = async () => {
    const count = await notificationService.fetchUnreadCount();
    setUnreadCount(count);
  };

  const handleOpen = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      await fetchNotifications();
      await fetchUnreadCount();
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    const success = await notificationService.markAsRead(notificationId);
    if (success) {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    const success = await notificationService.deleteNotification(notificationId);
    if (success) {
      const deleted = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (deleted && !deleted.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      const success = await notificationService.markAsRead(notification.id);
      if (success) setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));

    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'mention':
        if (notification.post_id) navigate(`/community?post=${notification.post_id}`);
        break;
      case 'follow':
        navigate(`/profile/${notification.actor_username}`);
        break;
      case 'message':
        navigate('/chat');
        break;
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like': return <FontAwesomeIcon icon={faHeart} className="text-red-500" />;
      case 'comment': return <FontAwesomeIcon icon={faComment} className="text-blue-500" />;
      case 'follow': return <FontAwesomeIcon icon={faUserPlus} className="text-green-500" />;
      case 'mention': return <FontAwesomeIcon icon={faAt} className="text-yellow-500" />;
      case 'repost': return <FontAwesomeIcon icon={faRepeat} className="text-purple-500" />;
      case 'message': return <FontAwesomeIcon icon={faEnvelope} className="text-cyan-500" />;
      default: return <FontAwesomeIcon icon={faHeart} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (!currentUser) return null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-zenith-greenDim/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faHeart} className={`text-xl transition-colors ${isOpen ? 'text-zenith-primary' : 'text-zenith-dim'}`} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <>
              <motion.span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-zenith-bg z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
              <motion.span
                className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-96 bg-zenith-surface border border-zenith-greenDim rounded-xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zenith-greenDim">
              <h3 className="font-bold text-lg">Activity</h3>
              {unreadCount > 0 && (
                <motion.button onClick={handleMarkAllAsRead} className="text-sm text-zenith-primary hover:text-zenith-primary/80 flex items-center gap-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
                  Mark all read
                </motion.button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div className="w-8 h-8 border-b-2 border-zenith-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-zenith-dim">
                  <FontAwesomeIcon icon={faHeart} className="text-4xl mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-zenith-greenDim/10 border-b border-zenith-greenDim last:border-0 ${!notification.is_read ? 'bg-zenith-primary/5' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={notification.actor_avatar || `https://picsum.photos/seed/${notification.actor_id}/40/40`} alt={notification.actor_username} className="w-10 h-10 rounded-full object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zenith-surface rounded-full flex items-center justify-center text-xs border border-zenith-greenDim">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.actor_username}</span>{' '}
                        <span className="text-zenith-dim">{notification.message.replace(notification.actor_username, '').trim()}</span>
                      </p>
                      {notification.preview_text && <p className="text-xs text-zenith-dim mt-1 truncate">&ldquo;{notification.preview_text}&rdquo;</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zenith-dim">{formatTime(notification.created_at)}</span>
                        {!notification.is_read && <span className="w-2 h-2 bg-zenith-primary rounded-full" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.is_read && <button onClick={(e) => handleMarkAsRead(e, notification.id)} className="p-1.5 hover:bg-zenith-greenDim/30 rounded text-zenith-primary"><FontAwesomeIcon icon={faCheck} className="text-xs" /></button>}
                      <button onClick={(e) => handleDelete(e, notification.id)} className="p-1.5 hover:bg-red-500/20 rounded text-red-400"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-zenith-greenDim text-center">
                <button onClick={() => { setIsOpen(false); navigate('/notifications'); }} className="text-sm text-zenith-primary hover:text-zenith-primary/80">See all activity</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
