import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, title, message, actionText = 'Close' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Info className="text-yellow-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                <p className="text-white/60 mb-8">
                  {message}
                </p>
                <div className="flex justify-end gap-3">
                   <button 
                      onClick={onClose}
                      className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      {actionText}
                    </button>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
