import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ActiveCall } from '../services/liveCallService';
import liveCallService from '../services/liveCallService';
import VideoCall from './VideoCall';

interface IncomingCallProps {
  call: ActiveCall;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = ({ call, onAccept, onReject }) => {
  const isCaller = call.caller_id === JSON.parse(localStorage.getItem('zenith_user') || '{}').id;
  const caller = isCaller ? null : {
    name: call.caller_name || call.caller_username,
    avatar: call.caller_avatar
  };

  if (!caller) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        {/* Caller Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mx-auto mb-4">
            {caller.avatar ? (
              <img
                src={caller.avatar}
                alt={caller.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {caller.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {caller.name}
          </h2>
          <p className="text-gray-500">
            {call.status === 'ringing' ? 'Incoming call...' : 'Connecting...'}
          </p>
        </div>

        {/* Call Type */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <FontAwesomeIcon icon={faVideo} className="text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Video</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onReject}
            className="flex-1 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Decline
          </button>
          
          <button
            onClick={onAccept}
            className="flex-1 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 animate-pulse"
          >
            <FontAwesomeIcon icon={faPhone} />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

interface CallManagerProps {
  onCallEnd?: () => void;
}

const CallManager: React.FC<CallManagerProps> = ({ onCallEnd }) => {
  const [incomingCall, setIncomingCall] = useState<ActiveCall | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callHistory, setCallHistory] = useState<ActiveCall[]>([]);

  useEffect(() => {
    // Subscribe to call updates
    const subscription = liveCallService.subscribeToCalls((call) => {
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      
      if (call.status === 'ringing' && call.receiver_id === currentUser.id) {
        // Incoming call
        setIncomingCall(call);
      } else if (call.status === 'accepted') {
        // Call accepted
        setIncomingCall(null);
        setActiveCall(call);
      } else if (call.status === 'ended') {
        // Call ended
        setIncomingCall(null);
        setActiveCall(null);
        onCallEnd?.();
      }
    });

    // Check for existing calls on component mount
    checkExistingCalls();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkExistingCalls = async () => {
    try {
      const calls = await liveCallService.getActiveCalls();
      
      // Find ringing incoming calls
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      const ringingCall = calls.find(call => 
        call.status === 'ringing' && call.receiver_id === currentUser.id
      );
      
      if (ringingCall) {
        setIncomingCall(ringingCall);
      }
      
      // Find accepted calls
      const acceptedCall = calls.find(call => 
        call.status === 'accepted' && 
        (call.caller_id === currentUser.id || call.receiver_id === currentUser.id)
      );
      
      if (acceptedCall) {
        setActiveCall(acceptedCall);
      }
      
      setCallHistory(calls);
    } catch (error) {
      console.error('Error checking existing calls:', error);
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      await liveCallService.acceptCall(incomingCall.id);
      setActiveCall(incomingCall);
      setIncomingCall(null);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall) return;
    
    try {
      await liveCallService.rejectCall(incomingCall.id);
      setIncomingCall(null);
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
    onCallEnd?.();
  };

  // Play notification sound for incoming calls
  useEffect(() => {
    if (incomingCall) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Repeat the beep
      const interval = setInterval(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0.1;
        
        osc.start();
        osc.stop(audioContext.currentTime + 0.2);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [incomingCall]);

  return (
    <>
      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCall
          call={incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      
      {/* Active Call */}
      {activeCall && (
        <VideoCall
          call={activeCall}
          onEnd={handleEndCall}
        />
      )}
    </>
  );
};

export default CallManager;
