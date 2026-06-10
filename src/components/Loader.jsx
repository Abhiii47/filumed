import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [timecode, setTimecode] = useState('14:58:43:00');

  useEffect(() => {
    // Generate a ticking timecode for realism
    const intervalTc = setInterval(() => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      const frames = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 41); // Roughly 24fps

    return () => clearInterval(intervalTc);
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 2;
      current = Math.min(current + increment, 100);
      setPercent(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShutterOpen(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 400);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const blades = Array.from({ length: 8 });

  return (
    <AnimatePresence>
      {!shutterOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#050505] flex flex-col justify-between p-8 font-mono select-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Top Info HUD */}
          <div className="flex justify-between items-start text-secondary text-[10px] tracking-widest uppercase opacity-70">
            <div>
              <p>SYS // FILUMED_INITIALIZE</p>
              <p>FPS // 24.00_ACTIVE</p>
            </div>
            <div className="text-right">
              <p className="text-red-500 font-bold flex items-center justify-end gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-500"></span> REC // STDBY
              </p>
              <p className="mt-1">TC // {timecode}</p>
            </div>
          </div>

          {/* Shutter Animation Centerpiece */}
          <div className="relative flex-1 flex flex-col justify-center items-center">
            {/* Viewfinder Reticle */}
            <div className="absolute w-[280px] h-[280px] border border-white/5 rounded-full flex items-center justify-center">
              <div className="w-[120px] h-[120px] border border-white/10 rounded-full border-dashed" />
              {/* Corner marks */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30" />
            </div>

            {/* Simulated Shutter Blades */}
            <div className="absolute w-[320px] h-[320px] overflow-hidden rounded-full pointer-events-none flex items-center justify-center">
              {blades.map((_, i) => {
                const angle = i * 45;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[200px] h-[100px] bg-[#0c0c0d] border border-white/5"
                    style={{
                      transformOrigin: "0% 50%",
                      transform: `rotate(${angle}deg) translate(30px, 0px)`,
                    }}
                    animate={shutterOpen ? {
                      rotate: [angle, angle + 90],
                      scale: [1, 0],
                      opacity: [1, 0]
                    } : {}}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  />
                );
              })}
            </div>

            {/* Central percentage indicator */}
            <div className="text-center z-10">
              <span className="font-sans text-[64px] font-bold text-white tracking-tighter block leading-none">
                {percent.toString().padStart(3, '0')}%
              </span>
              <span className="text-secondary text-[9px] tracking-[0.25em] uppercase mt-3 block opacity-60">
                LENS LOCKING / BUFFERING
              </span>
            </div>
          </div>

          {/* Bottom Info HUD */}
          <div className="flex justify-between items-end text-secondary text-[10px] tracking-widest uppercase opacity-70">
            <div>
              <p>PROJECT // FILUMED_PROD_2026</p>
              <p>RENDERER // VITE_NEURAL_REEL</p>
            </div>
            <div className="text-right">
              <p>[ BUFFERING STAGES ]</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
