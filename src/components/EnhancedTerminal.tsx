import React, { useState, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService';
import { ThinkingIndicator } from './ThinkingIndicator';

interface HistoryEntry {
  command: string;
  output: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const EnhancedTerminal: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll vers le bas
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Ajouter la commande à l'historique
    const newEntry: HistoryEntry = {
      command: cmd,
      output: '',
      timestamp: new Date(),
      isLoading: true
    };
    setHistory(prev => [...prev, newEntry]);
    setInput('');
    setHistoryIndex(-1);

    try {
      // Commandes système
      if (cmd.startsWith('help')) {
        const helpText = `
🚀 ZENITH OS TERMINAL v1.0

Commandes disponibles:
  help           - Affiche cette aide
  clear          - Efface l'écran
  about          - À propos de ZENITH OS
  [texte]        - Envoie à l'IA ZENITH

Exemples:
  "Comment créer un site cyberpunk?"
  "Explique la blockchain simplement"
        `.trim();
        
        setHistory(prev => prev.map((h, i) => 
          i === prev.length - 1 ? {...h, output: helpText, isLoading: false} : h
        ));
      } else if (cmd === 'clear') {
        setHistory([]);
      } else if (cmd === 'about') {
        const aboutText = `
🌟 ZENITH CORE OS - Version 1.0
🤖 Powered by Gemini AI
🎨 Cyberpunk Interface
🚀 Built with React + TypeScript

"Le futur est maintenant."
        `.trim();
        
        setHistory(prev => prev.map((h, i) => 
          i === prev.length - 1 ? {...h, output: aboutText, isLoading: false} : h
        ));
      } else {
        // Envoyer à l'IA
        const response = await generateContent(cmd);
        setHistory(prev => prev.map((h, i) => 
          i === prev.length - 1 ? {...h, output: response, isLoading: false} : h
        ));
      }
    } catch (error) {
      const errorMsg = `❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
      setHistory(prev => prev.map((h, i) => 
        i === prev.length - 1 ? {...h, output: errorMsg, isLoading: false} : h
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = history.map(h => h.command).filter(Boolean);
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const commands = history.map(h => h.command).filter(Boolean);
        setInput(commands[commands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="bg-black border border-zenith-green/50 rounded-lg p-4 h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-zenith-green/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-zenith-green font-mono text-sm">ZENITH TERMINAL</div>
        <button 
          onClick={() => setHistory([])}
          className="text-zenith-dim hover:text-zenith-green text-xs"
        >
          CLEAR
        </button>
      </div>

      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto font-mono text-sm space-y-2 mb-4"
      >
        {history.map((entry, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-start">
              <span className="text-zenith-green mr-2">zenith@user:~$</span>
              <span className="text-white">{entry.command}</span>
            </div>
            {entry.isLoading ? (
              <ThinkingIndicator />
            ) : entry.output ? (
              <div className="text-zenith-dim ml-4 whitespace-pre-wrap">
                {entry.output}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <span className="text-zenith-green mr-2 font-mono">zenith@user:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white font-mono"
          placeholder="Tapez une commande..."
          autoFocus
        />
      </div>
    </div>
  );
};
