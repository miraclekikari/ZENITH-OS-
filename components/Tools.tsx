import React, { useState, useEffect, useRef } from 'react';
import { askZenithAI } from '../services/geminiService';

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
    <div className="bg-zenith-surface border border-zenith-greenDim p-4 rounded-xl max-w-xs w-full">
      <div className="text-xs text-zenith-green mb-2 font-tech">SYS.CALC_V2</div>
      <input className="w-full bg-black text-right text-xl p-3 mb-4 rounded border border-zenith-greenDim font-mono text-zenith-green" value={display} readOnly />
      <div className="grid grid-cols-4 gap-2">
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => btn === '=' ? evaluate() : btn === 'C' ? clear() : calc(btn)}
            className={`p-3 rounded font-bold hover:brightness-110 transition-all ${btn === '=' ? 'bg-zenith-green text-black col-span-2' : 'bg-white/5 hover:bg-white/10'}`}
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
      } catch (e) {
        console.error(e);
      }
    }
  }, [input]);

  return (
    <div className="bg-zenith-surface border border-zenith-greenDim p-4 rounded-xl w-full">
      <div className="text-xs text-zenith-green mb-2 font-tech">LATEX.ENGINE</div>
      <div className="flex flex-col md:flex-row gap-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-32 bg-black border border-zenith-greenDim p-2 text-sm font-mono text-zenith-green rounded resize-none focus:outline-none focus:border-zenith-green"
          placeholder="Enter LaTeX..."
        />
        <div className="flex-1 h-32 bg-white text-black p-4 rounded flex items-center justify-center overflow-auto">
          <div ref={previewRef} className="text-xl"></div>
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
    <div className="bg-zenith-surface border border-zenith-greenDim p-4 rounded-xl w-full h-96 flex flex-col">
       <div className="text-xs text-zenith-green mb-2 font-tech flex justify-between">
         <span>ZENITH.AI_CORE</span>
         <span className="animate-pulse">ONLINE</span>
       </div>
       <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
          {history.length === 0 && <div className="text-zenith-dim text-center mt-10">System Ready. Awaiting Input.</div>}
          {history.map((msg, i) => (
            <div key={i} className={`p-2 rounded max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-zenith-greenDim text-white self-end ml-auto' : 'bg-black border border-zenith-greenDim text-zenith-green'}`}>
              <strong>{msg.role === 'user' ? 'YOU' : 'ZENITH'}:</strong> {msg.text}
            </div>
          ))}
          {loading && <div className="text-zenith-green text-xs animate-pulse">Computing response...</div>}
       </div>
       <div className="flex gap-2">
         <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Query the Zenith Core..."
            className="flex-1 bg-black border border-zenith-greenDim rounded px-3 py-2 text-sm focus:outline-none focus:border-zenith-green"
         />
         <button onClick={handleSend} className="bg-zenith-green text-black px-4 py-2 rounded font-bold hover:opacity-80">
           <i className="fas fa-paper-plane"></i>
         </button>
       </div>
    </div>
  );
};