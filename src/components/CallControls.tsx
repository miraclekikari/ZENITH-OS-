import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faTimes, faMicrophone, faMicrophoneSlash, faVideoSlash, faDesktop, faUsers } from '@fortawesome/free-solid-svg-icons';

interface CallControlsProps {
  channelId: string;
  channelName: string;
  onClose: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({ channelId, channelName, onClose }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);

  const startVoiceCall = () => {
    setCallType('voice');
    setIsInCall(true);
    // TODO: Implement WebRTC voice call
    console.log(`Starting voice call in channel ${channelId}`);
  };

  const startVideoCall = () => {
    setCallType('video');
    setIsInCall(true);
    // TODO: Implement WebRTC video call
    console.log(`Starting video call in channel ${channelId}`);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    // TODO: Clean up WebRTC connections
    console.log(`Ending call in channel ${channelId}`);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute functionality
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // TODO: Implement actual video toggle
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // TODO: Implement screen sharing
  };

  if (!isInCall) {
    return (
      <div className="flex gap-2">
        <button
          onClick={startVoiceCall}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          title="Start Voice Call"
        >
          <FontAwesomeIcon icon={faPhone} />
        </button>
        <button
          onClick={startVideoCall}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          title="Start Video Call"
        >
          <FontAwesomeIcon icon={faVideo} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-zenith-surface rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 border-b border-zenith-greenDim">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-zenith-primary">
              {callType === 'voice' ? 'Voice Call' : 'Video Call'} - {channelName}
            </h3>
          </div>
          <button
            onClick={endCall}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Call Area */}
        <div className="h-96 flex items-center justify-center bg-zenith-bg">
          {callType === 'video' ? (
            <div className="text-center text-zenith-dim">
              <FontAwesomeIcon icon={faVideo} className="text-6xl mb-4 opacity-50" />
              <p>Video call interface</p>
              <p className="text-sm mt-2">WebRTC implementation needed</p>
            </div>
          ) : (
            <div className="text-center text-zenith-dim">
              <FontAwesomeIcon icon={faPhone} className="text-6xl mb-4 opacity-50" />
              <p>Voice call in progress</p>
              <p className="text-sm mt-2">WebRTC implementation needed</p>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4 p-4 border-t border-zenith-greenDim">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-lg transition-colors ${
              isMuted 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-zenith-greenDim text-zenith-primary hover:bg-zenith-greenDim/80'
            }`}
          >
            <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
          </button>
          
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-lg transition-colors ${
                isVideoOff 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-zenith-greenDim text-zenith-primary hover:bg-zenith-greenDim/80'
              }`}
            >
              <FontAwesomeIcon icon={isVideoOff ? faVideoSlash : faVideo} />
            </button>
          )}
          
          {callType === 'video' && (
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-lg transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-zenith-greenDim text-zenith-primary hover:bg-zenith-greenDim/80'
              }`}
            >
              <FontAwesomeIcon icon={faDesktop} />
            </button>
          )}
          
          <button
            onClick={endCall}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPhone} transform={{ rotate: 135 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallControls;
