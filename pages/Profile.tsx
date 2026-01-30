import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="relative mb-16">
        <div className="h-48 bg-gradient-to-r from-green-900 to-black rounded-xl border border-zenith-greenDim overflow-hidden">
          <img src="https://picsum.photos/seed/tech/1200/300" alt="Banner" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="absolute -bottom-12 left-8">
          <div className="w-32 h-32 rounded-full border-4 border-zenith-bg bg-black p-1">
             <img src="https://picsum.photos/seed/avatar/200/200" alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
           <button className="bg-zenith-surface border border-zenith-green text-zenith-green px-4 py-1 rounded-full text-sm font-bold hover:bg-zenith-green hover:text-black transition-colors">
             Edit Profile
           </button>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-3xl font-tech flex items-center gap-2">
          Zenith User <i className="fas fa-check-circle text-zenith-green text-xl"></i>
        </h2>
        <p className="text-zenith-dim">@campus_legend • Level 42 Architect</p>

        <div className="flex gap-8 my-6 border-y border-zenith-greenDim py-4">
           <div className="text-center">
             <div className="text-xl font-bold text-white">1,204</div>
             <div className="text-xs text-zenith-dim">Posts</div>
           </div>
           <div className="text-center">
             <div className="text-xl font-bold text-white">4.5k</div>
             <div className="text-xs text-zenith-dim">Followers</div>
           </div>
           <div className="text-center">
             <div className="text-xl font-bold text-white">890</div>
             <div className="text-xs text-zenith-dim">XP</div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-4">
            <h3 className="font-tech text-zenith-green mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
               {['Early Adopter', 'Code Master', 'Network Pro', 'AI Pioneer', 'Beta Tester'].map(badge => (
                 <span key={badge} className="text-xs bg-white/5 border border-zenith-greenDim px-3 py-1 rounded-full">{badge}</span>
               ))}
            </div>
          </div>
          
          <div className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-4">
             <h3 className="font-tech text-zenith-green mb-4">Recent Activity</h3>
             <ul className="space-y-2 text-sm text-zenith-dim">
               <li><i className="fas fa-check text-green-500 mr-2"></i> Completed "React Basics"</li>
               <li><i className="fas fa-star text-yellow-500 mr-2"></i> Earned 50 XP in Lab</li>
               <li><i className="fas fa-comment text-blue-500 mr-2"></i> Commented on "System Design"</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;