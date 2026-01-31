import React, { useState, useEffect, useRef } from 'react';
import { askZenithAI } from '../services/geminiService';

/* --- EXISTING TOOLS --- */

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('');
  const calc = (val: string) => setDisplay(prev => prev + val);
  const clear = () => setDisplay('');
  const evaluate = () => {
    try {
      // eslint-disable-next-line no-eval
      setDisplay(eval(display).toString());
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="glass-card p-4 rounded-xl w-full h-full flex flex-col">
      <div className="text-xs text-zenith-green mb-2 font-tech flex justify-between">
         <span>SYS.CALC_V2</span>
         <i className="fas fa-calculator"></i>
      </div>
      <input className="w-full bg-black text-right text-xl p-3 mb-4 rounded border border-zenith-greenDim font-mono text-zenith-green" value={display} readOnly />
      <div className="grid grid-cols-4 gap-2 flex-1">
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => btn === '=' ? evaluate() : btn === 'C' ? clear() : calc(btn)}
            className={`p-2 md:p-3 rounded font-bold hover:brightness-110 transition-all text-sm md:text-base ${btn === '=' ? 'bg-zenith-green text-black col-span-2' : 'bg-white/5 hover:bg-white/10'}`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export const LatexEditor: React.FC = () => {
  const [input, setInput] = useState('\\sqrt{x^2 + y^2} = z');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.katex && previewRef.current) {
      try {
        window.katex.render(input, previewRef.current, { throwOnError: false });
      } catch (e) { console.error(e); }
    }
  }, [input]);

  return (
    <div className="glass-card p-4 rounded-xl w-full">
      <div className="text-xs text-zenith-green mb-2 font-tech">LATEX.ENGINE</div>
      <div className="flex flex-col gap-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-24 bg-black border border-zenith-greenDim p-2 text-sm font-mono text-zenith-green rounded resize-none focus:outline-none focus:border-zenith-green"
          placeholder="Enter LaTeX..."
        />
        <div className="h-16 bg-white text-black p-2 rounded flex items-center justify-center overflow-auto">
          <div ref={previewRef} className="text-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const AIChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if(!query.trim()) return;
    const userMsg = query;
    setHistory(prev => [...prev, {role: 'user', text: userMsg}]);
    setQuery('');
    setLoading(true);
    const response = await askZenithAI(userMsg);
    setHistory(prev => [...prev, {role: 'ai', text: response}]);
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 rounded-xl w-full h-full flex flex-col min-h-[400px]">
       <div className="text-xs text-zenith-green mb-2 font-tech flex justify-between">
         <span>ZENITH.AI_CORE</span>
         <span className="animate-pulse text-green-400">● ONLINE</span>
       </div>
       <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zenith-dim opacity-50">
              <i className="fas fa-robot text-4xl mb-2"></i>
              <div>System Ready.</div>
            </div>
          )}
          {history.map((msg, i) => (
            <div key={i} className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-zenith-greenDim text-white self-end ml-auto' : 'bg-black border border-zenith-greenDim text-zenith-green'}`}>
              <strong className="block text-[10px] opacity-50 mb-1">{msg.role === 'user' ? 'COMMAND' : 'RESPONSE'}</strong> 
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-zenith-green text-xs animate-pulse">Computing...</div>}
       </div>
       <div className="flex gap-2 relative">
         <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Query the Zenith Core..."
            className="flex-1 bg-black border border-zenith-greenDim rounded px-4 py-3 text-sm focus:outline-none focus:border-zenith-green focus:ring-1 focus:ring-zenith-green"
         />
         <button onClick={handleSend} className="bg-zenith-green text-black px-4 py-2 rounded font-bold hover:opacity-80 transition-opacity">
           <i className="fas fa-paper-plane"></i>
         </button>
       </div>
    </div>
  );
};

/* --- NEW TOOLS --- */

export const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Session Complete!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-between h-full">
      <div className="text-xs text-zenith-green w-full font-tech flex justify-between">
        <span>POMODORO</span>
        <i className="fas fa-stopwatch"></i>
      </div>
      <div className="text-4xl font-mono font-bold my-4 text-white tracking-widest">{formatTime(timeLeft)}</div>
      <div className="flex gap-2 w-full">
        <button onClick={() => setIsActive(!isActive)} className={`flex-1 py-2 rounded font-bold text-black ${isActive ? 'bg-red-500' : 'bg-zenith-green'}`}>
          {isActive ? 'STOP' : 'START'}
        </button>
        <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="px-3 bg-white/10 rounded hover:bg-white/20">
          <i className="fas fa-redo"></i>
        </button>
      </div>
    </div>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  
  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  return (
    <div className="glass-card p-4 rounded-xl h-full flex flex-col justify-between">
      <div className="text-xs text-zenith-green mb-2 font-tech flex justify-between">
        <span>SECURE.GEN</span>
        <i className="fas fa-key"></i>
      </div>
      <div className="bg-black p-2 rounded border border-zenith-greenDim text-center font-mono text-zenith-green text-lg truncate mb-2">
        {password || '••••••••••••'}
      </div>
      <button onClick={generate} className="w-full bg-zenith-green text-black py-2 rounded font-bold hover:opacity-90">
        Generate
      </button>
    </div>
  );
};

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#00ff88');

  return (
    <div className="glass-card p-4 rounded-xl h-full flex flex-col items-center">
      <div className="text-xs text-zenith-green w-full font-tech mb-2">HEX.PICKER</div>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-16 bg-transparent border-none cursor-pointer mb-2"/>
      <div className="font-mono text-lg">{color.toUpperCase()}</div>
      <button onClick={() => navigator.clipboard.writeText(color)} className="text-xs text-zenith-dim hover:text-white mt-1">
        <i className="fas fa-copy"></i> Copy
      </button>
    </div>
  );
};

export const WebEditor: React.FC = () => {
  return (
    <div className="glass-card p-4 rounded-xl w-full">
      <div className="text-xs text-zenith-green mb-2 font-tech">WEB.EDITOR_LITE</div>
      <div className="grid grid-cols-2 gap-2 h-24">
        <div className="bg-black border border-zenith-greenDim p-2 text-xs font-mono text-gray-400 overflow-hidden">
          &lt;div class="box"&gt;<br/>&nbsp;&nbsp;Hello World<br/>&lt;/div&gt;
        </div>
        <div className="bg-white text-black p-2 flex items-center justify-center font-bold border border-zenith-greenDim">
          Hello World
        </div>
      </div>
    </div>
  );
};
