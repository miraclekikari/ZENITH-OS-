import { supabase } from '../lib/supabaseClient';

export interface LiveSession {
  id: string;
  channel_id: string;
  host_id: string;
  title?: string;
  status: 'live' | 'ended';
  started_at: string;
  viewer_count: number;
  host_username?: string;
  host_name?: string;
  host_avatar?: string;
}

export interface ActiveCall {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: 'ringing' | 'accepted' | 'rejected' | 'ended';
  created_at: string;
  offer?: any;
  answer?: any;
  caller_username?: string;
  caller_name?: string;
  caller_avatar?: string;
  receiver_username?: string;
  receiver_name?: string;
  receiver_avatar?: string;
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

class LiveCallService {
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private callId: string | null = null;

  constructor() {
    this.setupWebRTCConfig();
  }

  private setupWebRTCConfig(): WebRTCConfig {
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
      ]
    };
  }

  // === LIVE SESSIONS ===

  async startLiveSession(channelId: string, title: string): Promise<string | null> {
    try {
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      if (!currentUser.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('start_live_session', {
        p_channel_id: channelId,
        p_host_id: currentUser.id,
        p_title: title
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting live session:', error);
      return null;
    }
  }

  async endLiveSession(sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('end_live_session', {
        p_session_id: sessionId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error ending live session:', error);
      return false;
    }
  }

  async getActiveLiveSessions(): Promise<LiveSession[]> {
    try {
      const { data, error } = await supabase
        .from('active_live_sessions')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      return [];
    }
  }

  subscribeToLiveSessions(callback: (session: LiveSession) => void) {
    return supabase
      .channel('live_sessions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'live_sessions' },
        (payload) => {
          if (payload.new) {
            callback(payload.new as LiveSession);
          }
        }
      )
      .subscribe();
  }

  // === WEBRTC CALLS ===

  async initiateCall(receiverId: string): Promise<string | null> {
    try {
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      if (!currentUser.id) {
        throw new Error('User not authenticated');
      }

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.setupWebRTCConfig());
      this.setupPeerConnection();

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Initiate call in database
      const { data, error } = await supabase.rpc('initiate_call', {
        p_receiver_id: receiverId,
        p_offer: offer
      });

      if (error) throw error;
      
      this.callId = data;
      return data;
    } catch (error) {
      console.error('Error initiating call:', error);
      return null;
    }
  }

  async acceptCall(callId: string): Promise<boolean> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.setupWebRTCConfig());
      this.setupPeerConnection();

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Get call details
      const { data: callData, error: callError } = await supabase
        .from('active_calls')
        .select('offer')
        .eq('id', callId)
        .single();

      if (callError) throw callError;

      // Set remote description
      await this.peerConnection.setRemoteDescription(callData.offer);

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Accept call in database
      const { data, error } = await supabase.rpc('accept_call', {
        p_call_id: callId,
        p_answer: answer
      });

      if (error) throw error;
      
      this.callId = callId;
      return data || false;
    } catch (error) {
      console.error('Error accepting call:', error);
      return false;
    }
  }

  async rejectCall(callId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('reject_call', {
        p_call_id: callId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error rejecting call:', error);
      return false;
    }
  }

  async endCall(): Promise<boolean> {
    try {
      if (!this.callId) return false;

      const { data, error } = await supabase.rpc('end_call', {
        p_call_id: this.callId
      });

      if (error) throw error;

      this.cleanup();
      return data || false;
    } catch (error) {
      console.error('Error ending call:', error);
      return false;
    }
  }

  async getActiveCalls(): Promise<ActiveCall[]> {
    try {
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      if (!currentUser.id) return [];

      const { data, error } = await supabase
        .from('user_active_calls')
        .select('*')
        .or(`caller_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active calls:', error);
      return [];
    }
  }

  subscribeToCalls(callback: (call: ActiveCall) => void) {
    const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
    if (!currentUser.id) return null;

    return supabase
      .channel(`user_calls_${currentUser.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'active_calls' },
        (payload) => {
          if (payload.new) {
            callback(payload.new as ActiveCall);
          }
        }
      )
      .subscribe();
  }

  private setupPeerConnection() {
    if (!this.peerConnection) return;

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.callId) {
        // In a real implementation, you'd send ICE candidates via WebSockets
        console.log('ICE candidate:', event.candidate);
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStream?.(this.remoteStream);
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('Connection state:', this.peerConnection.connectionState);
        this.onConnectionStateChange?.(this.peerConnection.iceConnectionState);
      }
    };
  }

  // Callbacks for UI updates
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCIceConnectionState) => void;

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.callId = null;
  }
}

export default new LiveCallService();
