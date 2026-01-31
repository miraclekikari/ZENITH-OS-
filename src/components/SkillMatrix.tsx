import React, { useState } from 'react';
import { SkillNode } from '../types';

const INITIAL_SKILLS: SkillNode[] = [
  // Root
  { id: 'root', label: 'Core OS', description: 'Basic understanding of Zenith Operating System navigation.', cost: 0, status: 'MASTERED', x: 50, y: 10, dependencies: [], icon: 'fa-microchip' },
  
  // Left Branch (Security)
  { id: 'sec1', label: 'NetSec I', description: 'Introduction to network security protocols and firewalls.', cost: 10, status: 'AVAILABLE', x: 25, y: 30, dependencies: ['root'], icon: 'fa-shield-alt' },
  { id: 'sec2', label: 'Cryptography', description: 'Understanding hashing, encryption, and salting.', cost: 25, status: 'LOCKED', x: 15, y: 55, dependencies: ['sec1'], icon: 'fa-key' },
  { id: 'sec3', label: 'White Hat', description: 'Advanced penetration testing methodologies.', cost: 50, status: 'LOCKED', x: 25, y: 80, dependencies: ['sec2'], icon: 'fa-user-secret' },

  // Right Branch (Dev)
  { id: 'dev1', label: 'React.js', description: 'Component based architecture and hooks.', cost: 10, status: 'MASTERED', x: 75, y: 30, dependencies: ['root'], icon: 'fa-code' },
  { id: 'dev2', label: 'TypeScript', description: 'Static typing for scalable web applications.', cost: 20, status: 'AVAILABLE', x: 85, y: 55, dependencies: ['dev1'], icon: 'fa-brackets-curly' },
  { id: 'dev3', label: 'FullStack', description: 'Server-side rendering and database management.', cost: 45, status: 'LOCKED', x: 75, y: 80, dependencies: ['dev2'], icon: 'fa-server' },

  // Center (AI)
  { id: 'ai1', label: 'LLM Basics', description: 'Prompt engineering and model configuration.', cost: 30, status: 'LOCKED', x: 50, y: 50, dependencies: ['root'], icon: 'fa-brain' },
];

export const SkillMatrix: React.FC = () => {
  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILLS);
  const [credits, setCredits] = useState(120); // Mock credits
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const handleUnlock = (skill: SkillNode) => {
    if (skill.status !== 'AVAILABLE') return;
    if (credits < skill.cost) {
      alert("INSUFFICIENT CREDITS");
      return;
    }

    const confirm = window.confirm(`Unlock ${skill.label} for ${skill.cost} Credits?`);
    if (!confirm) return;

    setCredits(c => c - skill.cost);

    // Update skills
    const newSkills = skills.map(s => {
      if (s.id === skill.id) return { ...s, status: 'MASTERED' as const };
      return s;
    });

    // Check for newly unlocked skills (dependencies met)
    const finalSkills = newSkills.map(s => {
      if (s.status === 'LOCKED') {
        const parents = newSkills.filter(p => s.dependencies.includes(p.id));
        const allParentsMastered = parents.every(p => p.status === 'MASTERED');
        if (allParentsMastered) return { ...s, status: 'AVAILABLE' as const };
      }
      return s;
    });

    setSkills(finalSkills);
    setSelectedNode({ ...skill, status: 'MASTERED' });
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'MASTERED': return 'border-zenith-green bg-zenith-green text-black shadow-[0_0_15px_var(--z-primary)]';
      case 'AVAILABLE': return 'border-white bg-black text-white hover:border-zenith-green cursor-pointer';
      case 'LOCKED': return 'border-gray-700 bg-black/50 text-gray-700 cursor-not-allowed';
      default: return 'border-gray-700';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[600px] glass-card rounded-xl overflow-hidden animate-fade-in">
      
      {/* Visual Matrix Area */}
      <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)] p-4 overflow-hidden group">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {skills.map(skill => {
            return skill.dependencies.map(depId => {
              const parent = skills.find(s => s.id === depId);
              if (!parent) return null;
              
              const isPathActive = parent.status === 'MASTERED' && skill.status !== 'LOCKED';
              
              return (
                <line 
                  key={`${parent.id}-${skill.id}`}
                  x1={`${parent.x}%`} 
                  y1={`${parent.y}%`} 
                  x2={`${skill.x}%`} 
                  y2={`${skill.y}%`} 
                  stroke={isPathActive ? 'var(--z-primary)' : '#333'} 
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
              );
            });
          })}
        </svg>

        {/* Nodes Layer */}
        {skills.map(skill => (
          <div 
            key={skill.id}
            onClick={() => setSelectedNode(skill)}
            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${getNodeColor(skill.status)} ${selectedNode?.id === skill.id ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
          >
             <i className={`fas ${skill.icon} text-lg`}></i>
             
             {/* Hover Label */}
             <div className="absolute -bottom-8 bg-black border border-zenith-greenDim px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-zenith-green font-mono">
               {skill.label}
             </div>
          </div>
        ))}
      </div>

      {/* Info Sidebar */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zenith-greenDim bg-zenith-surface p-6 flex flex-col z-20">
         <div className="mb-6 flex justify-between items-center">
            <h3 className="font-tech text-white text-xl">NEURAL LINK</h3>
            <div className="text-right">
              <div className="text-xs text-zenith-dim">CREDITS</div>
              <div className="text-xl font-mono text-zenith-green font-bold">{credits}</div>
            </div>
         </div>

         {selectedNode ? (
           <div className="flex-1 animate-fade-in">
             <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center text-3xl border ${selectedNode.status === 'MASTERED' ? 'bg-zenith-green text-black border-zenith-green' : 'bg-black text-white border-white'}`}>
                <i className={`fas ${selectedNode.icon}`}></i>
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-1">{selectedNode.label}</h2>
             <div className="flex gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedNode.status === 'MASTERED' ? 'bg-zenith-green text-black' : selectedNode.status === 'AVAILABLE' ? 'bg-blue-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                  {selectedNode.status}
                </span>
                {selectedNode.status !== 'MASTERED' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">
                    COST: {selectedNode.cost}
                  </span>
                )}
             </div>

             <p className="text-sm text-gray-300 leading-relaxed mb-8 border-b border-zenith-greenDim pb-4">
               {selectedNode.description}
             </p>

             {selectedNode.status === 'AVAILABLE' && (
               <button 
                 onClick={() => handleUnlock(selectedNode)}
                 className="w-full bg-zenith-green text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_var(--z-primary)] transition-all flex items-center justify-center gap-2"
               >
                 <i className="fas fa-unlock"></i> INITIALIZE UPLOAD
               </button>
             )}
             
             {selectedNode.status === 'LOCKED' && (
               <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs flex items-center gap-2">
                 <i className="fas fa-lock"></i>
                 <span>Prerequisites not met. Complete previous nodes.</span>
               </div>
             )}

              {selectedNode.status === 'MASTERED' && (
               <div className="p-3 bg-zenith-greenDim rounded text-zenith-green text-xs flex items-center gap-2">
                 <i className="fas fa-check-circle"></i>
                 <span>Skill Neural Pathway Active.</span>
               </div>
             )}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-zenith-dim opacity-50">
             <i className="fas fa-project-diagram text-6xl mb-4"></i>
             <p className="text-center text-sm">Select a node from the matrix to view parameters.</p>
           </div>
         )}
      </div>
    </div>
  );
};
