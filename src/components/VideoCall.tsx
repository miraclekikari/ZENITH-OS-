import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faVideo, 
  faMicrophone, 
  faMicrophoneSlash, 
  faVideoSlash, 
  faVolumeUp, 
  faVolumeMute, 
  faDesktop, 
  faTimes, 
  faUserPlus 
} from '@fortawesome/free-solid-svg-icons';
import { ActiveCall } from '../services/liveCallService';
import liveCallService from '../services/liveCallService';

interface VideoCallProps {
  call: ActiveCall;
  onEnd: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ call, onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize WebRTC and capture camera immediately
    const initializeWebRTC = async () => {
      try {
        // Request camera and microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        // Set local video stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Initialize peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
          ]
        });
        
        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('ICE candidate:', event.candidate);
            // In real implementation, send this to signaling server
          }
        };
        
        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        
        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          setConnectionState(peerConnection.connectionState);
        };
        
        // Store peer connection for signaling
        (liveCallService as any).peerConnection = peerConnection;
        (liveCallService as any).localStream = stream;
        
        // Setup callbacks
        liveCallService.onRemoteStream = (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        };

        liveCallService.onConnectionStateChange = (state) => {
          setConnectionState(state);
        };
        
        setConnectionState('connected');
        
      } catch (error) {
        console.error('Error accessing camera/microphone:', error);
        setConnectionState('failed');
      }
    };
    
    initializeWebRTC();

    return () => {
      // Cleanup on unmount
      const localStream = (liveCallService as any).localStream;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      const peerConnection = (liveCallService as any).peerConnection;
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, []);

  const handleToggleMute = () => {
    const localStream = liveCallService.getLocalStream();
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    const localStream = liveCallService.getLocalStream();
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleToggleSpeaker = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !isSpeakerOff;
      setIsSpeakerOff(!isSpeakerOff);
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        const peerConnection = (liveCallService as any).peerConnection;
        if (peerConnection) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnection.getSenders().find(
            (s: RTCRtpSender) => s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
            setIsScreenSharing(true);
            
            // Stop screen sharing when user ends it
            videoTrack.onended = () => {
              setIsScreenSharing(false);
              // Restore camera
              handleToggleVideo();
            };
          }
        }
      } else {
        // Restore camera
        handleToggleVideo();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const handleEndCall = async () => {
    await liveCallService.endCall();
    onEnd();
  };

  const getConnectionStateColor = () => {
    switch (connectionState) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStateText = () => {
    switch (connectionState) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  const isCaller = call.caller_id === JSON.parse(localStorage.getItem('zenith_user') || '{}').id;
  const otherUser = isCaller ? {
    name: call.receiver_name || call.receiver_username,
    avatar: call.receiver_avatar
  } : {
    name: call.caller_name || call.caller_username,
    avatar: call.caller_avatar
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <span className="text-white font-bold">
                  {otherUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">{otherUser.name}</h3>
            <p className={`text-sm ${getConnectionStateColor()}`}>
              {getConnectionStateText()}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleEndCall}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faPhone} className="transform rotate-135" />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Full Screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <FontAwesomeIcon icon={faVideoSlash} className="text-white text-2xl" />
            </div>
          )}
        </div>

        {/* Connection Status Overlay */}
        {connectionState !== 'connected' && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto" />
              <p className="text-white text-lg">{getConnectionStateText()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone */}
          <button
            onClick={handleToggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
          </button>

          {/* Video */}
          <button
            onClick={handleToggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={isVideoOff ? faVideoSlash : faVideo} />
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faDesktop} />
          </button>

          {/* Speaker */}
          <button
            onClick={handleToggleSpeaker}
            className={`p-4 rounded-full transition-colors ${
              isSpeakerOff 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={isSpeakerOff ? faVolumeMute : faVolumeUp} />
          </button>

          {/* Add Participant */}
          <button className="p-4 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
