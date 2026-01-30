import React from 'react';
import { Calculator, LatexEditor, AIChat } from '../components/Tools';

const Lab: React.FC = () => {
  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* AI Section */}
      <div className="lg:col-span-2">
        <AIChat />
      </div>

      {/* Tools Section */}
      <div className="flex justify-center">
        <Calculator />
      </div>

      <div className="flex flex-col">
        <LatexEditor />
        <div className="mt-4 bg-zenith-surface border border-zenith-greenDim p-4 rounded-xl flex-1">
          <div className="text-xs text-zenith-green mb-2 font-tech">TERMINAL.ACCESS</div>
          <div className="font-mono text-xs text-zenith-dim space-y-1">
            <p>> System check... OK</p>
            <p>> Zenith Core v5.2 loaded</p>
            <p>> Connected to secure server</p>
            <p>> User authenticated</p>
            <p className="animate-pulse">_</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Lab;