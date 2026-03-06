import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';

const mockResults = [
  { id: '1', pseudo: 'Nova_Agent', status: 'ONLINE', signal: 98 },
  { id: '2', pseudo: 'Cyber_Pilot_X', status: 'ONLINE', signal: 82 },
  { id: '3', pseudo: 'Ghost_in_the_Shell', status: 'OFFLINE', signal: 0 },
  { id: '4', pseudo: 'Data_Wraith', status: 'ONLINE', signal: 76 },
  { id: '5', pseudo: 'Binary_Sorcerer', status: 'OFFLINE', signal: 0 },
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-tech text-2xl text-white tracking-[0.15em] mb-6 select-none">
          {' > NETWORK_SCAN'}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="font-mono text-emerald-400">[ SEARCH_OPERATOR ]</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            className="w-full bg-black/[0.3] border border-white/[0.05] rounded-md h-14 pl-[220px] pr-12 text-white/80 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono tracking-wider"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {isScanning ? (
              <span className="font-mono text-xs text-cyan-400 animate-pulse">SCANNING SECTOR 7G...</span>
            ) : (
              <SearchIcon className="text-white/30" size={20}/>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/[0.2] border border-white/[0.05] rounded-md p-4">
          <div className="grid grid-cols-3 gap-4 text-white/40 font-mono text-sm border-b border-white/[0.05] pb-2 mb-3">
            <span>PSEUDO</span>
            <span>STATUS</span>
            <span className="text-right">SIGNAL</span>
          </div>
          <div>
            {mockResults.map((result, index) => (
              <motion.div 
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="grid grid-cols-3 gap-4 items-center py-2 font-mono text-sm transition-all hover:bg-white/[0.02] rounded-md px-2 -mx-2">
                <span className="text-white/80 truncate">{result.pseudo}</span>
                <div>
                  <span className={result.status === 'ONLINE' ? 'text-emerald-400' : 'text-red-500'}>
                    {result.status}
                  </span>
                </div>
                <div className={`text-right ${result.status === 'ONLINE' ? 'text-white/80' : 'text-white/30'}`}>
                  {result.status === 'ONLINE' ? `${result.signal}%` : 'N/A'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
