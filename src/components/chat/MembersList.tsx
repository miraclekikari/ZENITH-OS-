import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Profile } from './ChatArea'; // Re-using the type from ChatArea

interface MembersListProps {
  channelId: number | null;
}

// A simple component for the status indicator, as requested
const UserStatus: React.FC<{ status: 'online' | 'offline' | string | undefined }> = ({ status }) => {
  const bgColor = status === 'online' ? 'bg-green-500' : 'bg-gray-500';
  return <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${bgColor} border-2 border-[#2f3136]`}></span>;
};

const MembersList: React.FC<MembersListProps> = ({ channelId }) => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!channelId) {
      setMembers([]);
      return;
    }

    const fetchMembers = async () => {
      setLoading(true);
      try {
        // Assumption: A 'channel_members' join table exists with 'channel_id' and 'profile_id' columns.
        const { data: memberIds, error: idsError } = await supabase
          .from('channel_members')
          .select('profile_id')
          .eq('channel_id', channelId);

        if (idsError) throw idsError;
        if (!memberIds || memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }
        
        const profileIds = memberIds.map(m => m.profile_id);

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', profileIds);
        
        if (profilesError) throw profilesError;

        setMembers(profilesData as Profile[]);

      } catch (error: any) {
        console.error("Error fetching members:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [channelId]);

  const groupedMembers = members.reduce((acc, member) => {
    const role = member.role || 'USER'; // Default role
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, Profile[]>);

  const roleOrder = ['ADMIN', 'HELPER', 'USER'];
  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
      const indexA = roleOrder.indexOf(a.toUpperCase());
      const indexB = roleOrder.indexOf(b.toUpperCase());
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
  });


  return (
    <div className="w-[240px] bg-[#2f3136] flex-shrink-0 flex flex-col pt-3 px-2" aria-label="Members list">
      <div className="flex-1 overflow-y-auto pr-1">
        {loading && <div className="text-gray-400 p-2">Loading members...</div>}
        
        {!loading && sortedRoles.map(role => (
          <div key={role} className="mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase p-1">{role} — {groupedMembers[role].length}</h2>
            <div className="space-y-1 mt-2">
              {groupedMembers[role].map(member => (
                <div key={member.id} className="flex items-center p-1 rounded hover:bg-gray-700/50 cursor-pointer">
                  <div className="relative">
                    <img src={member.avatar_url || 'https://via.placeholder.com/32'} alt={member.username} className="w-8 h-8 rounded-full" />
                    <UserStatus status={member.status} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-300">{member.username}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!loading && members.length === 0 && (
            <div className="text-gray-400 p-2 text-sm">No members in this channel.</div>
        )}

      </div>
    </div>
  );
};

export default MembersList;
