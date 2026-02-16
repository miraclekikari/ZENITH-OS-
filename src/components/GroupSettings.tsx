import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBroadcastTower, faUsers, faSettings, faLock, faGlobe, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Channel } from '../types/chat';

interface GroupSettingsProps {
  channel: Channel;
  onClose: () => void;
  onUpdate: (updates: Partial<Channel>) => void;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({ channel, onClose, onUpdate }) => {
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [channelName, setChannelName] = useState(channel.name);
  const [channelDescription, setChannelDescription] = useState(channel.description || '');
  const [isPrivate, setIsPrivate] = useState(channel.type === 'private');

  const handleToggleLive = () => {
    if (!isLive && !liveTitle.trim()) {
      alert('Please enter a title for your live stream');
      return;
    }
    
    setIsLive(!isLive);
    
    if (!isLive) {
      // Starting live stream
      const liveUpdates = {
        isLive: true,
        liveTitle: liveTitle.trim(),
        liveDescription: liveDescription.trim(),
        liveStartedAt: new Date().toISOString(),
      };
      
      onUpdate(liveUpdates);
      
      // TODO: Start actual streaming service
      console.log('Starting live stream:', {
        title: liveTitle,
        description: liveDescription,
        channelId: channel.id,
      });
    } else {
      // Stopping live stream
      const liveUpdates = {
        isLive: false,
        liveEndedAt: new Date().toISOString(),
      };
      
      onUpdate(liveUpdates);
      
      // TODO: Stop actual streaming service
      console.log('Stopping live stream');
    }
  };

  const handleSaveSettings = () => {
    const updates = {
      name: channelName.trim(),
      description: channelDescription.trim(),
      type: isPrivate ? 'private' : 'channel' as const,
    };
    
    onUpdate(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-zenith-surface rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zenith-greenDim">
          <h3 className="font-semibold text-zenith-primary flex items-center gap-2">
            <FontAwesomeIcon icon={faSettings} />
            Group Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zenith-greenDim/20 rounded text-zenith-dim"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Basic Settings */}
          <div>
            <label className="block text-sm font-medium text-zenith-primary mb-2">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg text-zenith-primary focus:outline-none focus:ring-2 focus:ring-zenith-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zenith-primary mb-2">
              Description
            </label>
            <textarea
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg text-zenith-primary focus:outline-none focus:ring-2 focus:ring-zenith-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-zenith-primary bg-zenith-bg border-zenith-greenDim rounded focus:ring-zenith-primary"
              />
              <FontAwesomeIcon icon={isPrivate ? faLock : faGlobe} className="text-zenith-dim" />
              <span className="text-sm text-zenith-primary">
                {isPrivate ? 'Private Channel' : 'Public Channel'}
              </span>
            </label>
          </div>

          {/* Live Stream Settings */}
          <div className="border-t border-zenith-greenDim pt-4">
            <h4 className="font-medium text-zenith-primary flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBroadcastTower} />
              Live Stream Settings
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zenith-primary mb-2">
                  Live Stream Title
                </label>
                <input
                  type="text"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder="Enter a title for your live stream..."
                  disabled={isLive}
                  className="w-full px-3 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg text-zenith-primary focus:outline-none focus:ring-2 focus:ring-zenith-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zenith-primary mb-2">
                  Live Stream Description
                </label>
                <textarea
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  placeholder="Describe your live stream..."
                  rows={2}
                  disabled={isLive}
                  className="w-full px-3 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg text-zenith-primary focus:outline-none focus:ring-2 focus:ring-zenith-primary disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleToggleLive}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isLive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-zenith-primary text-white hover:bg-zenith-primary/80'
                }`}
              >
                <FontAwesomeIcon icon={faBroadcastTower} />
                {isLive ? 'Stop Live Stream' : 'Start Live Stream'}
              </button>

              {isLive && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">LIVE NOW</span>
                  </div>
                  <p className="text-xs text-red-300 mt-1">
                    Your stream is being broadcast to the community
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Members Section */}
          <div className="border-t border-zenith-greenDim pt-4">
            <h4 className="font-medium text-zenith-primary flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faUsers} />
              Members ({channel.members?.length || 0})
            </h4>
            <div className="text-sm text-zenith-dim">
              Member management coming soon...
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-zenith-greenDim">
          <button
            onClick={handleSaveSettings}
            className="flex-1 py-2 bg-zenith-primary text-white rounded-lg hover:bg-zenith-primary/80 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-zenith-greenDim text-zenith-primary rounded-lg hover:bg-zenith-greenDim/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
