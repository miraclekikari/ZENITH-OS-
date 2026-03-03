import React from 'react';
import { motion } from 'framer-motion';
import { Book, Cpu, ShieldCheck, Code, PlayCircle, Clock, Layers } from 'lucide-react';

const courses = [
  { id: 1, title: 'Kernel Architecture Deep Dive', category: 'SYSTEM', duration: '3h', image: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=800&q=80' },
  { id: 2, title: 'Secure Coding & Exploit Prevention', category: 'SECURITY', duration: '2h', image: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&q=80' },
  { id: 3, title: 'Assembly Language for Modern CPUs', category: 'LOW-LEVEL', duration: '5h', image: 'https://images.unsplash.com/photo-1550064824-7AE341392349?w=800&q=80' },
  { id: 4, title: 'Network Protocol Analysis', category: 'NETWORK', duration: '1h', image: 'https://images.unsplash.com/photo-1584949092497-7c50352d0b5c?w=800&q=80' },
  { id: 5, title: 'Cryptography Fundamentals', category: 'SECURITY', duration: '3h', image: 'https://images.unsplash.com/photo-1632167993510-537a7d3a7c64?w=800&q=80' },
  { id: 6, title: 'Advanced Memory Management', category: 'SYSTEM', duration: '2h', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80' },
];

const Academy: React.FC = () => {
  const featuredCourse = courses[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 text-white"
    >
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-8">
        <Book size={32} className="text-zenith-green" />
        <div>
          <h1 className="font-tech text-3xl md:text-4xl text-white tracking-widest">ACADEMY</h1>
          <p className="text-zenith-dim text-sm">Forge your core system knowledge.</p>
        </div>
      </div>

      {/* Module en Vedette */}
      <div className="bg-gradient-to-br from-zenith-surface to-black border border-zenith-greenDim rounded-2xl mb-12 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="w-full md:w-1/3 h-56 rounded-xl overflow-hidden shadow-lg shadow-zenith-green/10">
          <img src={featuredCourse.image} alt={featuredCourse.title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex-1">
          <span className="font-semibold text-zenith-green text-sm tracking-widest">FEATURED MODULE</span>
          <h2 className="font-bold text-3xl my-2 text-white">{featuredCourse.title}</h2>
          <p className="text-zenith-dim text-sm mt-2 mb-6">Master the low-level components of modern operating systems and kernel development. A foundational course for any serious developer.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="bg-zenith-green text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-zenith-green/20 transition-all"
          >
            <PlayCircle size={20} />
            Start Module
          </motion.button>
        </div>
      </div>

      {/* Liste des modules */}
      <h3 className="font-tech text-xl mb-6 border-l-4 border-zenith-green pl-4 flex items-center gap-3"><Layers size={20}/> Available Modules</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: course.id * 0.05 }}
            className="bg-zenith-surface border border-zenith-greenDim/50 rounded-xl overflow-hidden hover:border-zenith-green transition-colors group cursor-pointer"
          >
            <div className="h-40 overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-zenith-green border border-zenith-green/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {course.category === 'SYSTEM' && <Cpu size={12}/>}
                  {course.category === 'SECURITY' && <ShieldCheck size={12}/>}
                  {course.category === 'LOW-LEVEL' && <Code size={12}/>}
                  {course.category}
                </span>
                <span className="text-xs text-zenith-dim flex items-center gap-1.5"><Clock size={12} /> {course.duration}</span>
              </div>
              <h4 className="font-bold text-lg leading-tight mt-3 text-white">{course.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Academy;
