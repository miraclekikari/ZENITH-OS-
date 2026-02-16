import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faUserCheck, faTimes, faCircle, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabaseClient';

interface Contact {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen?: string;
  bio?: string;
}

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose, onSelectContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'new'>('all');

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchContacts();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');
      if (!currentUser.id) return;

      // Fetch all profiles except current user
      const { data, error } = await supabase
        .from('chat_profiles')
        .select('*')
        .neq('id', currentUser.id)
        .order('username');

      if (error) throw error;

      const transformedContacts: Contact[] = (data || []).map(profile => ({
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name || profile.username,
        avatar_url: profile.avatar_url,
        is_online: Math.random() > 0.5, // Simulated online status
        last_seen: profile.updated_at,
        bio: profile.bio
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'online') {
      return matchesSearch && contact.is_online;
    }
    return matchesSearch;
  });

  const handleStartChat = (contact: Contact) => {
    onSelectContact(contact);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-zenith-primary text-black placeholder-gray-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'all', label: 'All', count: contacts.length },
            { id: 'online', label: 'Online', count: contacts.filter(c => c.is_online).length },
            { id: 'new', label: 'New', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-zenith-primary border-b-2 border-zenith-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zenith-primary"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faUserPlus} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 'No contacts found' : 'No contacts available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartChat(contact)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt={contact.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {contact.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online Indicator */}
                    {contact.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {contact.full_name}
                      </h3>
                      {contact.is_online && (
                        <FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      @{contact.username}
                    </p>
                    {contact.bio && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {contact.bio}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle voice call
                      }}
                      className="p-2 text-gray-400 hover:text-zenith-primary transition-colors"
                      title="Voice Call"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle video call
                      }}
                      className="p-2 text-gray-400 hover:text-zenith-primary transition-colors"
                      title="Video Call"
                    >
                      <FontAwesomeIcon icon={faVideo} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 bg-zenith-primary text-black rounded-lg font-medium hover:bg-zenith-primary/80 transition-colors">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;
