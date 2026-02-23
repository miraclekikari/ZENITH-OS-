import React from 'react';
import Icon from '../Icon'; // Assuming a generic Icon component exists

const tools = [
  { id: 'studio', name: 'Studio', icon: 'layout-template', pro: false },
  { id: 'camera', name: 'Camera', icon: 'camera-retro', pro: false },
  { id: 'import', name: 'Import', icon: 'upload', pro: false },
  { id: 'text', name: 'Text', icon: 'font', pro: false },
  { id: 'filters', name: 'Filters', icon: 'filter', pro: false },
  { id: 'effects', name: 'Effects', icon: 'magic', pro: true },
  { id: 'adjust', name: 'Adjust', icon: 'sliders-h', pro: false },
  { id: 'import-tool', name: 'Import Tools', icon: 'plus-square', pro: true, disabled: true },
];

interface ToolboxProps {
  activeTool: string;
  onSelectTool: (toolId: string) => void;
}

const ToolButton: React.FC<{ 
  tool: typeof tools[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ tool, isActive, onClick }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={tool.disabled}
        className={`
          w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 
          ${isActive
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'
          }
          ${tool.disabled ? 'opacity-30 cursor-not-allowed' : ''}
        `}
      >
        <Icon icon={tool.icon} className="text-xl" />
        {tool.pro && (
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111111] text-[7px] font-bold flex items-center justify-center text-white"
          >
            P
          </div>
        )}
      </button>
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0a0a0a] border border-white/10 rounded-md text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        {tool.name}
        {tool.disabled && <span className="text-white/50 ml-2">(Coming Soon)</span>}
      </div>
    </div>
  );
};

const Toolbox: React.FC<ToolboxProps> = ({ activeTool, onSelectTool }) => {
  return (
    <nav className="w-20 bg-[#111111] h-full flex flex-col items-center p-3 gap-3 border-r border-white/[0.04]">
      <div className="w-12 h-12 flex items-center justify-center">
        {/* Placeholder for Logo */}
        <Icon icon="cubes" className="text-3xl text-white/80" />
      </div>
      <div className="w-full h-[1px] bg-white/[0.04] my-1" />
      {tools.map(tool => (
        <ToolButton 
          key={tool.id} 
          tool={tool} 
          isActive={activeTool === tool.id} 
          onClick={() => onSelectTool(tool.id)} 
        />
      ))}
    </nav>
  );
};

export default Toolbox;
