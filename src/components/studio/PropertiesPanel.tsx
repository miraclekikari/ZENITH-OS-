import React from 'react';
import Icon from '../Icon';

interface PropertiesPanelProps {
  activeTool: string;
  // Add any other props needed for the panels, like onAddSticker, onApplyEffect, etc.
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ activeTool }) => {

  const renderPanelContent = () => {
    switch (activeTool) {
        // Example for a future text properties panel
        case 'text':
            return (
                <div>
                    <h3 className="text-white/80 font-semibold mb-3">Text Properties</h3>
                    {/* Font family, size, color, alignment etc. will go here */}
                    <div className="text-white/30 text-sm">Text properties are coming soon.</div>
                </div>
            );
        
        case 'filters':
             return (
                <div>
                    <h3 className="text-white/80 font-semibold mb-3">Filters</h3>
                     <div className="text-white/30 text-sm">Filters are coming soon.</div>
                </div>
            );

        // Add cases for 'stickers', 'effects', 'adjust' here

        default:
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Icon icon="sliders-h" className="text-3xl text-white/20 mb-3" />
                    <h3 className="text-white/50 font-semibold">Properties</h3>
                    <p className="text-white/30 text-xs mt-1">Select an object or tool to see its properties.</p>
                </div>
            );
    }
  }

  return (
    <aside className="w-72 bg-[#111111] h-full border-l border-white/[0.04] p-4">
      <h2 className="text-white font-bold mb-4 text-lg capitalize flex items-center gap-2">
          <Icon icon="sliders-h" className="text-white/40"/>
          Properties
      </h2>
      {renderPanelContent()}
    </aside>
  );
};

export default PropertiesPanel;
