import React from 'react';
import { Calculator, LatexEditor, AIChat, PomodoroTimer, PasswordGenerator, ColorPicker, WebEditor } from '../components/Tools';

const Lab: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-tech text-white">DIGITAL LABO</h2>
          <p className="text-zenith-dim text-sm">Experimental tools and utilities.</p>
        </div>
        <div className="text-xs font-mono text-zenith-green border border-zenith-green px-2 py-1 rounded">
          SYSTEM_READY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Module - Spans 2 cols on Large screens */}
        <div className="lg:col-span-2 h-[500px]">
          <AIChat />
        </div>

        {/* Sidebar Tools - Stacked */}
        <div className="space-y-6 flex flex-col h-[500px]">
           <div className="flex-1">
             <Calculator />
           </div>
           <div className="flex-1">
             <PomodoroTimer />
           </div>
        </div>
      </div>

      {/* Secondary Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-48">
          <PasswordGenerator />
        </div>
        <div className="h-48">
          <ColorPicker />
        </div>
        <div className="md:col-span-2 h-48">
          <WebEditor />
        </div>
      </div>

      {/* Bottom Section: LaTeX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <LatexEditor />
        </div>
        
        {/* Terminal Visual */}
        <div className="glass-card p-4 rounded-xl font-mono text-xs flex flex-col">
          <div className="text-zenith-green mb-2 border-b border-zenith-greenDim pb-1">TERMINAL.LOG</div>
          <div className="flex-1 space-y-1 text-zenith-dim overflow-hidden">
            <p>> initializing modules...</p>
            <p>> pomodoro_service: <span className="text-green-500">active</span></p>
            <p>> secure_gen: <span className="text-green-500">ready</span></p>
            <p>> ai_link: <span className="text-green-500">established</span></p>
            <p>> waiting for user input...</p>
            <p className="animate-pulse text-zenith-green">_</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Lab;
