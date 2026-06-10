import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'view' | 'play' | 'pointer'
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 450, mass: 0.35 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const interactive = target.closest('a, button, [role="button"], .group, input, select, textarea');
      
      if (interactive) {
        // Customize text depending on element characteristics
        const isProjectCard = interactive.closest('#showcase') || interactive.classList.contains('group');
        const isVideoCard = interactive.classList.contains('showreel-card');

        if (isVideoCard) {
          setCursorType('play');
        } else if (isProjectCard) {
          setCursorType('view');
        } else {
          setCursorType('pointer');
        }
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === 'undefined' || !isVisible) return null;

  return (
    <>
      {/* Outer viewfinder ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[160] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: cursorType === 'view' || cursorType === 'play' ? 2.2 : cursorType === 'pointer' ? 1.4 : 1,
          backgroundColor: cursorType === 'view' || cursorType === 'play' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
          borderColor: cursorType === 'view' || cursorType === 'play' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Inside viewfinder crosshair lines */}
        {(cursorType === 'default' || cursorType === 'pointer') && (
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-0 w-1.5 h-[1px] bg-white/60 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-1.5 h-[1px] bg-white/60 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 w-[1px] h-1.5 bg-white/60 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-[1px] h-1.5 bg-white/60 -translate-x-1/2" />
          </div>
        )}

        {/* View / Play labels */}
        {(cursorType === 'view' || cursorType === 'play') && (
          <span className="font-mono text-[7px] text-white tracking-[0.2em] font-bold uppercase select-none pointer-events-none">
            {cursorType}
          </span>
        )}
      </motion.div>

      {/* Tiny inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[160] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: cursorType === 'view' || cursorType === 'play' ? 0 : 1,
        }}
      />
    </>
  );
}
