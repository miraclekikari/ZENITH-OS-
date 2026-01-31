import React from 'react';
import { Course } from '../types';

const courses: Course[] = [
  { id: '1', title: 'Network Infrastructure 101', category: 'Networks', duration: '10h', image: 'https://picsum.photos/seed/net/400/200' },
  { id: '2', title: 'Fullstack React Development', category: 'Dev', duration: '24h', image: 'https://picsum.photos/seed/react/400/200' },
  { id: '3', title: 'Cybersecurity Essentials', category: 'Security', duration: '8h', image: 'https://picsum.photos/seed/cyber/400/200' },
  { id: '4', title: 'Artificial Intelligence Basics', category: 'AI', duration: '12h', image: 'https://picsum.photos/seed/ai/400/200' },
];

const Academy: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Featured Card */}
      <div className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <img src="https://picsum.photos/seed/feature/400/300" alt="Featured" className="w-full md:w-64 h-40 object-cover rounded-lg border border-zenith-greenDim" />
        <div className="flex-1">
          <span className="text-xs bg-zenith-green text-black px-2 py-1 rounded font-bold">RECOMMENDED</span>
          <h2 className="text-2xl font-tech text-white mt-2">Advanced System Architecture</h2>
          <p className="text-zenith-dim text-sm mt-2 mb-4">Master the low-level components of modern operating systems and kernel development.</p>
          <button className="bg-zenith-green text-black px-6 py-2 rounded font-bold hover:scale-105 transition-transform">
            Start Module
          </button>
        </div>
      </div>

      <h3 className="font-tech text-xl mb-4 border-l-4 border-zenith-green pl-3">Available Modules</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-zenith-surface border border-zenith-greenDim rounded-xl overflow-hidden hover:border-zenith-green transition-colors group cursor-pointer">
            <div className="h-32 overflow-hidden">
               <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] text-zenith-green border border-zenith-greenDim px-2 rounded">{course.category}</span>
                 <span className="text-[10px] text-zenith-dim"><i className="far fa-clock"></i> {course.duration}</span>
              </div>
              <h4 className="font-bold text-lg leading-tight">{course.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Academy;
