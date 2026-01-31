import React, { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade out after 3.5s
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 3500);

    // Notify App to show content after 4s
    const timer2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-black z-[9999] flex flex-col justify-center items-center transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex items-center gap-5 animate-scale-up">
        <i className="fas fa-microchip text-6xl md:text-8xl text-zenith-green drop-shadow-[0_0_30px_rgba(0,255,136,0.4)]"></i>
        <div className="font-tech text-4xl md:text-6xl font-black text-white tracking-widest">
          ZENITH <span className="text-zenith-green">CORE</span>
        </div>
      </div>
      <div className="h-1 bg-zenith-green mt-6 shadow-[0_0_20px_rgba(0,255,136,0.4)] animate-expand-line"></div>
    </div>
  );
};

export default Intro;
