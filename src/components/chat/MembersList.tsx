import React, { useEffect, useState } from 'react';
import { getMembers, Profile } from '../../services/chatService'; // Updated import
import { Search } from 'lucide-react';

interface MembersListProps {
  channelId: number | null;
}

const StatusDot: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111111] ${
      status === 'online' ? 'bg-emerald-400' : 'bg-white/20'
    }`}
  />
);

const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN': return 'text-emerald-400';
    case 'HELPER': return 'text-cyan-400';
    default: return 'text-white/70';
  }
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
        const membersData = await getMembers(channelId);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [channelId]);

  const grouped = members.reduce((acc, m) => {
    const role = m.role || 'USER';
    if (!acc[role]) acc[role] = [];
    acc[role].push(m);
    return acc;
  }, {} as Record<string, Profile[]>);

  const roleOrder = ['ADMIN', 'HELPER', 'USER'];
  const sortedRoles = Object.keys(grouped).sort((a, b) => {
    const iA = roleOrder.indexOf(a.toUpperCase());
    const iB = roleOrder.indexOf(b.toUpperCase());
    return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
  });

  return (
    <div className="w-[240px] bg-[#111111] flex-shrink-0 flex flex-col border-l border-white/[0.04]" aria-label="Members list">
      {/* Search */}
      <div className="p-2">
        <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-md px-3 py-1.5">
          <Search size={14} className="text-white/20" />
          <input
            type="text"
            placeholder="Search members"
            className="bg-transparent text-xs text-white placeholder-white/20 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hide">
        {loading ? (
          <div className="text-white/30 text-xs p-2">Loading...</div>
        ) : sortedRoles.length === 0 ? (
            <div className="text-white/20 text-xs p-2 text-center">No members found for this channel.</div>
        ) : sortedRoles.map((role) => (
          <div key={role} className="mb-3">
            <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-wider px-1 mb-1.5">
              {role} -- {grouped[role].length}
            </h3>
            <div className="space-y-0.5">
              {grouped[role].map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-white/[0.04] cursor-pointer group transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
                      alt={member.username}
                      className={`w-8 h-8 rounded-full ${member.status === 'offline' ? 'opacity-40' : ''}`}
                      crossOrigin="anonymous"
                    />
                    <StatusDot status={member.status} />
                  </div>
                  <span className={`text-sm font-medium truncate ${member.status === 'offline' ? 'text-white/25' : getRoleColor(member.role)}`}>
                    {member.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
