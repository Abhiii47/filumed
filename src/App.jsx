import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Import our custom components
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import CinematicParticles from './components/CinematicParticles';
import { PixelTrail } from './components/ui/pixel-trail';
import { BackgroundBeams } from './components/ui/background-beams';
import { ImageTrail } from './components/ui/image-trail';

// --- DATA DEFINITIONS ---

const projectsData = [
  {
    id: "01",
    badge: "#FILM",
    category: "FILM & DOCUMENTARY",
    title: "THE SILENT OBSERVER",
    desc: "FEATURE DOCUMENTARY / 2024",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLsrcukxxu5R3eFnBJezfnMEPezrYRKV2jZl9mMjSM82kde9uukToZLF7y7mqI4Tz3hDPzE89yxs2u_2sgFwCVEF0ZvjB1qXgc3nvyl8N0JdwUJiTwkKsLbXJZEyOun_4E0_anRDWKKC2EPJCjfB_R1V-CtGQ-GOoV3Qfu5opoUmnf3Vv_Ad6kQ81kuVY4tqMSZiRdVQ_nmKYsJI9T4v0sMczG9KtFId_03MsdNDTp-l4zlGlCchzgAO0m8"
  },
  {
    id: "02",
    badge: "#COMMERCIAL",
    category: "TV COMMERCIALS",
    title: "KINETIC PULSE",
    desc: "SPORTSWEAR CAMPAIGN / 2024",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLu0H8BXeVCqrKwE4spvHPcky494U48hhJKEXjOeJrIkOsCQdRQHxrDdP0xnuuoYQASl1JHyVNK0htU0vsKsME7pdhpYV40t5DTJhDw_vyZdl6UqQvIffpBObzWAFAd6DLs2IkHHq7FpYzNreZddAAVt5DHK3FPktch9NfX0tZy4IBovkJxCpDojxmpB5Dyvo6fyoSQO3waFl8rTZKkfeYamOpdU9YTGM1vJfoRw8CEpxmI1ahah-ko2pA"
  },
  {
    id: "03",
    badge: "#MUSIC",
    category: "MUSIC VIDEOS",
    title: "NEON DREAMS",
    desc: "OFFICIAL MUSIC VIDEO / 2023",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLsFssXwajszinWDiIFpJrQn8xRvXckSftv4QD2EnrV_bEpx1tYrq3lcxNysCpxGgbNTvjGrvtl0BQlXp0QDlVg4ZOa2LqpVseq4IOAIhpatXSWbq9q9riS8HURf9odA1PCmClLNLBwwRk4hYGYmKnVqNdZLJF7--zaAqudDmNNuTgHY_TvP0UwPH98DJlV6J6FNsCMgwlRlY9Hq9y29xlNOUwzdJmRXzmGzcSsPw77g47E-dagh7iDmAEs"
  },
  {
    id: "04",
    badge: "#COMMERCIAL",
    category: "TV COMMERCIALS",
    title: "MERCURY AUTO GROUP",
    desc: "PROD_ID: COM_772",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLsk3drb0Tv_ZZFS4ce_g6Xp3lpqA7bXZapnQF_p3U1kihq-Eg5G3DqX8CDI8Gp6pkZcOKCfOLjxZg3CIPrP-39JeZh9UpDVPWViAFaUR6rqpMiFMddNLKh9La534llNQXLd3x4rTTRaHUG8cftwv15eOiPW2XFvpu5TXdWOYM4KA1hXuu8x3dDJ3Ayf-Ss-6ycoPcU9ctWZ9T2O17wpK-486uRwcmUsbD26TzNaM0XVxJOLbhYTSkPwLhc"
  },
  {
    id: "05",
    badge: "#COMMERCIAL",
    category: "TV COMMERCIALS",
    title: "URBAN APPAREL SPRING",
    desc: "PROD_ID: COM_910",
    img: "/girl_headphones.png"
  },
  {
    id: "06",
    badge: "#COMMERCIAL",
    category: "TV COMMERCIALS",
    title: "TECHNO LOGISTICS GLOBAL",
    desc: "PROD_ID: COM_443",
    img: "/packaging_minimal.png"
  }
];

// --- ANIMATION HELPER COMPONENTS ---

function ScrollReveal({ children, delay = 0, y = 30 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RevealBorderBottom({ children, className = "", delay = 0 }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1.5px] bg-primary-fixed"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// --- SHUTTER TRANSITION BAR SYSTEM ---

function ShutterTransition({ state }) {
  const bars = [0, 1, 2, 3];
  return (
    <div className="fixed inset-0 z-[150] pointer-events-none flex flex-col">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-full bg-[#050505] border-b border-white/5"
          style={{ height: "25vh" }}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: state === 'closing' ? 1 : 0,
            transformOrigin: state === 'closing' ? "left" : "right"
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.76, 0, 0.24, 1]
          }}
        />
      ))}
    </div>
  );
}

// --- APP COMPONENT ---

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'work'
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shutterState, setShutterState] = useState('open'); // 'open' | 'closing' | 'opening'

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const navigateTo = (targetPage) => {
    setShutterState('closing');
    setTimeout(() => {
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setShutterState('opening');
      setTimeout(() => {
        setShutterState('open');
      }, 500);
    }, 500);
  };

  return (
    <>
      <Loader onComplete={() => setLoadingComplete(true)} />
      
      {loadingComplete && (
        <>
          <CustomCursor />
          <div className="film-grain" />
          
          <div className={page === 'home' ? 'page-home' : 'page-work'}>
            {page === 'home' ? (
              <HomePage onNavigate={navigateTo} />
            ) : (
              <WorkPage onNavigate={navigateTo} />
            )}
          </div>

          <ShutterTransition state={shutterState} />
        </>
      )}
    </>
  );
}

// --- INTERACTIVE SERVICES LIST ITEM ---

function ServiceRow({ title, index, imageUrl }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    setCoords({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="service-line group flex justify-between items-center py-8 border-b border-outline-variant hover:border-primary-fixed transition-colors relative cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="font-sans text-3xl md:text-[48px] text-primary transition-all group-hover:text-primary-fixed group-hover:pl-4 uppercase font-bold tracking-tight">
        {title}
      </h3>
      <span className="material-symbols-outlined text-[48px] md:text-[64px] text-primary-fixed opacity-0 group-hover:opacity-100 transition-all">
        arrow_forward
      </span>
      
      {hovered && (
        <div 
          className="pointer-events-none fixed z-[100] w-[200px] h-[260px] md:w-[260px] md:h-[340px] border-4 border-primary-fixed overflow-hidden -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          <img 
            alt={title} 
            className="w-full h-full object-cover grayscale contrast-125" 
            src={imageUrl} 
          />
        </div>
      )}
    </div>
  );
}

// --- CINEMATIC VIEWPORT HUD COMPONENT (adds visual weight to Hero) ---

function CinematicViewportHUD() {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const cardRef = useRef(null);

  const images = [
    '/cinematic_bg.png',
    '/glass_sculpture.png',
    '/girl_headphones.png'
  ];

  // Rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Update timecode
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      const frames = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 41);
    return () => clearInterval(interval);
  }, []);

  // 3D Tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // tilt amount
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)`;
  };

  return (
    <div className="relative w-full max-w-[480px] aspect-[4/3] z-10 px-4 md:px-0">
      {/* Background glow shadow */}
      <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
      
      {/* Viewport Frame */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full rounded border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden relative transition-all duration-300 ease-out shadow-2xl flex flex-col justify-between p-4 group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gloss reflection sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

        {/* Top HUD Row */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#a1a1aa] z-10 select-none">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>REC // PLAYBACK</span>
          </div>
          <div>{timecode}</div>
        </div>

        {/* Cinematic Content Area */}
        <div className="absolute inset-0 w-full h-full z-0 p-4 pt-10 pb-10">
          <div className="relative w-full h-full overflow-hidden border border-white/5 bg-zinc-950 flex items-center justify-center">
            {/* Widescreen cinema bar overlays */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-black/90 z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/90 z-10" />
            
            {/* Cinematic crop widescreen aspect guide overlay lines */}
            <div className="absolute top-4 left-0 right-0 h-px bg-white/10 z-10" />
            <div className="absolute bottom-4 left-0 right-0 h-px bg-white/10 z-10" />

            {/* Corner crop marks */}
            <div className="absolute top-5 left-1.5 w-3 h-3 border-t border-l border-white/40 z-10" />
            <div className="absolute top-5 right-1.5 w-3 h-3 border-t border-r border-white/40 z-10" />
            <div className="absolute bottom-5 left-1.5 w-3 h-3 border-b border-l border-white/40 z-10" />
            <div className="absolute bottom-5 right-1.5 w-3 h-3 border-b border-r border-white/40 z-10" />

            {/* Simulated grain inside viewer */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.04] pointer-events-none z-10" />

            {/* Sliding Image Carousel */}
            {images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt="Cinematic still"
                className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-1000 ${currentImgIdx === idx ? 'opacity-70 scale-100' : 'opacity-0 scale-105'} transition-transform duration-[4500ms] ease-out`}
              />
            ))}

            {/* Center play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <span className="material-symbols-outlined text-white text-5xl translate-y-0 group-hover:scale-110 transition-transform duration-300">
                play_arrow
              </span>
            </div>
          </div>
        </div>

        {/* Bottom HUD Row */}
        <div className="flex justify-between items-end text-[10px] font-mono tracking-widest text-[#a1a1aa] z-10 select-none">
          <div className="flex flex-col gap-0.5">
            <span>F/5.6 · 1/48s</span>
            <span>50.0MM // ANAMORPHIC</span>
          </div>
          
          {/* Active Audio Levels Visualizer HUD */}
          <div className="flex items-end gap-[3px] h-6">
            {Array.from({ length: 6 }).map((_, i) => {
              const delays = ['0.1s', '0.4s', '0.2s', '0.6s', '0.3s', '0.5s'];
              return (
                <div
                  key={i}
                  className="w-[3px] bg-white rounded-t-sm"
                  style={{
                    height: '100%',
                    animation: 'bounceAudio 1s ease-in-out infinite alternate',
                    animationDelay: delays[i],
                    transformOrigin: 'bottom'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HOME PAGE COMPONENT ---

function HomePage({ onNavigate }) {
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef(null);

  const toggleNav = () => {
    setNavOpen(!navOpen);
    if (!navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleLinkClick = (hashId) => {
    setNavOpen(false);
    document.body.style.overflow = 'auto';
    const element = document.getElementById(hashId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav drawer variants
  const navContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -30, skewY: 3 },
    visible: { 
      opacity: 1, 
      x: 0, 
      skewY: 0,
      transition: { type: "spring", stiffness: 150, damping: 20 }
    }
  };

  // Hero text animations
  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const titleLineVariants = {
    hidden: { y: "100%", rotate: 1 },
    visible: {
      y: "0%",
      rotate: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen relative overflow-hidden">
      
      {/* NAVIGATION DRAWER (Overlay) */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col justify-center items-start p-margin-edge overflow-hidden border-r border-outline-variant"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            id="nav-drawer"
          >
            <button className="absolute top-margin-edge right-margin-edge text-primary-fixed hover:scale-95 transition-transform" onClick={toggleNav}>
              <span className="material-symbols-outlined text-[48px]">close</span>
            </button>
            <motion.div 
              className="flex flex-col gap-unit"
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={navItemVariants} className="font-mono text-[11px] tracking-widest text-[#8e8e93] mb-4">EST. 2024</motion.span>
              <nav className="flex flex-col">
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl md:text-5xl text-on-background hover:text-primary-fixed hover:pl-8 transition-all duration-300 py-2 border-b border-outline-variant text-left uppercase font-bold" 
                  onClick={() => { toggleNav(); onNavigate('work'); }}
                >
                  WORK
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl md:text-5xl text-on-background hover:text-primary-fixed hover:pl-8 transition-all duration-300 py-2 border-b border-outline-variant text-left uppercase font-bold" 
                  onClick={() => handleLinkClick('services')}
                >
                  SERVICES
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl md:text-5xl text-on-background hover:text-primary-fixed hover:pl-8 transition-all duration-300 py-2 border-b border-outline-variant text-left uppercase font-bold" 
                  onClick={() => handleLinkClick('bts')}
                >
                  STUDIO
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl md:text-5xl text-on-background hover:text-primary-fixed hover:pl-8 transition-all duration-300 py-2 border-b border-outline-variant text-left uppercase font-bold" 
                  onClick={() => handleLinkClick('about')}
                >
                  ABOUT
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl md:text-5xl text-on-background hover:text-primary-fixed hover:pl-8 transition-all duration-300 py-2 text-left uppercase font-bold" 
                  onClick={() => handleLinkClick('contact')}
                >
                  CONTACT
                </motion.button>
              </nav>
              <motion.div variants={navItemVariants} className="mt-stack-md">
                <button 
                  className="bg-primary-fixed text-[#050505] font-mono text-xs font-bold px-8 py-4 hover:bg-white hover:text-black transition-colors"
                  onClick={() => handleLinkClick('contact')}
                >
                  START PROJECT
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER / TOPBAR */}
      <motion.header 
        className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-edge py-6 bg-transparent mix-blend-difference"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 
          className="font-sans text-xl md:text-[24px] text-primary-fixed uppercase font-bold tracking-tighter cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          FILUMED PRODUCTION
        </h1>
        
        <button className="text-primary-fixed scale-95 active:duration-100 hover:scale-90 transition-transform" onClick={toggleNav}>
          <span className="material-symbols-outlined text-[40px]">menu</span>
        </button>
      </motion.header>

      {/* SECTION 1: HERO */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center px-margin-edge pt-32 overflow-hidden" 
        id="hero"
      >
        {/* Cinematic Particles */}
        <CinematicParticles />

        {/* Technical Background Beams */}
        <BackgroundBeams className="opacity-35 z-0" />

        {/* Image Trail Cursor Animation */}
        <ImageTrail containerRef={heroRef}>
          <img src="https://lh3.googleusercontent.com/aida/AP1WRLsrcukxxu5R3eFnBJezfnMEPezrYRKV2jZl9mMjSM82kde9uukToZLF7y7mqI4Tz3hDPzE89yxs2u_2sgFwCVEF0ZvjB1qXgc3nvyl8N0JdwUJiTwkKsLbXJZEyOun_4E0_anRDWKKC2EPJCjfB_R1V-CtGQ-GOoV3Qfu5opoUmnf3Vv_Ad6kQ81kuVY4tqMSZiRdVQ_nmKYsJI9T4v0sMczG9KtFId_03MsdNDTp-l4zlGlCchzgAO0m8" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
          <img src="https://lh3.googleusercontent.com/aida/AP1WRLu0H8BXeVCqrKwE4spvHPcky494U48hhJKEXjOeJrIkOsCQdRQHxrDdP0xnuuoYQASl1JHyVNK0htU0vsKsME7pdhpYV40t5DTJhDw_vyZdl6UqQvIffpBObzWAFAd6DLs2IkHHq7FpYzNreZddAAVt5DHK3FPktch9NfX0tZy4IBovkJxCpDojxmpB5Dyvo6fyoSQO3waFl8rTZKkfeYamOpdU9YTGM1vJfoRw8CEpxmI1ahah-ko2pA" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
          <img src="https://lh3.googleusercontent.com/aida/AP1WRLsFssXwajszinWDiIFpJrQn8xRvXckSftv4QD2EnrV_bEpx1tYrq3lcxNysCpxGgbNTvjGrvtl0BQlXp0QDlVg4ZOa2LqpVseq4IOAIhpatXSWbq9q9riS8HURf9odA1PCmClLNLBwwRk4hYGYmKnVqNdZLJF7--zaAqudDmNNuTgHY_TvP0UwPH98DJlV6J6FNsCMgwlRlY9Hq9y29xlNOUwzdJmRXzmGzcSsPw77g47E-dagh7iDmAEs" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
          <img src="https://lh3.googleusercontent.com/aida/AP1WRLsk3drb0Tv_ZZFS4ce_g6Xp3lpqA7bXZapnQF_p3U1kihq-Eg5G3DqX8CDI8Gp6pkZcOKCfOLjxZg3CIPrP-39JeZh9UpDVPWViAFaUR6rqpMiFMddNLKh9La534llNQXLd3x4rTTRaHUG8cftwv15eOiPW2XFvpu5TXdWOYM4KA1hXuu8x3dDJ3Ayf-Ss-6ycoPcU9ctWZ9T2O17wpK-486uRwcmUsbD26TzNaM0XVxJOLbhYTSkPwLhc" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
          <img src="/girl_headphones.png" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
          <img src="/packaging_minimal.png" alt="" className="w-40 h-28 object-cover grayscale opacity-90 border border-white/20 shadow-2xl bg-zinc-950" />
        </ImageTrail>

        {/* Pixel Trail Background Animation */}
        <PixelTrail
          pixelSize={48}
          fadeDuration={700}
          delay={0}
          pixelClassName="bg-white/5 border border-white/5"
          className="opacity-30 z-[1] pointer-events-auto"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-container-max w-full z-10 mx-auto items-center text-left">
          {/* Left Column: Title & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            <motion.div 
              className="mb-gutter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-primary-fixed text-[#050505] font-mono text-[11px] font-bold px-3 py-1 inline-block uppercase tracking-wider">
                BRANDS TALK, WE MAKE PEOPLE LISTEN
              </span>
            </motion.div>

            <motion.h2 
              className="flex flex-col text-left w-full relative z-10"
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="overflow-hidden py-1">
                <motion.span 
                  variants={titleLineVariants}
                  className="block font-sans text-[36px] md:text-[80px] font-bold text-primary leading-none uppercase tracking-tighter"
                >
                  A STUDIO BUILT FOR
                </motion.span>
              </div>
              
              <div className="overflow-hidden py-1">
                <motion.span 
                  variants={titleLineVariants}
                  className="block font-sans text-[36px] md:text-[80px] font-bold text-primary-fixed leading-none uppercase tracking-tighter"
                >
                  → STORYTELLERS AND
                </motion.span>
              </div>

              <div className="overflow-hidden py-1 flex items-center flex-wrap gap-4 md:gap-6 w-full">
                <motion.span 
                  variants={titleLineVariants}
                  className="font-sans text-[36px] md:text-[80px] font-bold text-primary-fixed leading-none uppercase tracking-tighter"
                >
                  VISIONARIES
                </motion.span>

                <motion.div 
                  className="hidden xl:block max-w-[300px] font-mono text-[10px] text-[#8e8e93] text-left self-end pb-3 ml-auto leading-relaxed uppercase opacity-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  [MISSION_LOG_V2.0]<br />
                  ESTABLISHING VISUAL AUTHORITY THROUGH RAW NARRATIVE PRECISION. 
                  ENGINEERED IN 2024.
                </motion.div>
              </div>
            </motion.h2>
            
            <motion.div
              className="flex gap-4 mt-12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button 
                className="bg-primary-fixed text-[#050505] font-mono text-xs font-bold px-8 py-4 border border-primary-fixed uppercase hover:bg-transparent hover:text-primary-fixed transition-colors"
                onClick={() => onNavigate('work')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Showcase
              </motion.button>
              <motion.button 
                className="border border-outline text-primary font-mono text-xs font-bold px-8 py-4 uppercase hover:border-primary-fixed hover:text-primary-fixed transition-colors"
                onClick={() => handleLinkClick('contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Studio
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Interactive Viewport HUD */}
          <div className="lg:col-span-5 w-full flex justify-center mt-8 lg:mt-0">
            <CinematicViewportHUD />
          </div>
        </div>

        {/* Marquee scroll bottom */}
        <div className="absolute bottom-10 left-0 w-full marquee overflow-hidden pointer-events-none select-none">
          <div className="marquee-content flex gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <span key={idx} className="text-outline font-sans text-5xl md:text-[64px] font-bold whitespace-nowrap uppercase opacity-45">
                FILM &amp; DOCUMENTARY
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES (Interactive List with Hover Image Reveal) */}
      <section className="py-stack-xl px-margin-edge bg-[#000000] relative z-10" id="services">
        <div className="max-w-container-max mx-auto">
          <RevealBorderBottom className="flex justify-between items-baseline mb-gutter pb-4">
            <span className="font-mono text-xs text-primary-fixed font-bold tracking-widest">[ #SERVICES ]</span>
            <span className="font-mono text-[10px] text-secondary uppercase tracking-[0.2em]">[001—008]</span>
          </RevealBorderBottom>
          
          <div className="flex flex-col mt-8">
            <ServiceRow 
              title="FILM & DOCUMENTARY" 
              index="01" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-Kn0zyfgXLEbuBAfrKVbjsnmBedXcTHuxJdA8QbMPYvexg8E_bDSDmVALC79swsQVHbGojTci-QRn5-KUyp1HOcUC8YdJequkRlI1unNZHhDf32MNxImpTyzTJK5ilSZHAqvlnLDH4sQ92xnBeESl-c-0iX2h5Gd-Ar-xUpCo0zHb-0mPKnOJVLBGVg77aH5N6OP_GCu84mPiWFfdIh4zosnk5CSj0pTZNh7w3dVNhLXhvHZXK2T1K9t7drHjsO7DnDbRHA3tx0" 
            />
            <ServiceRow 
              title="TV COMMERCIALS" 
              index="02" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDv2uSRn-I_qwds0uAdciL9vmJSvjbQdtSBdaT97vO_aNEMhGOpaAvnsspnGz-oHkg9PutnA70DaeWQWgL4BKjnit4EUmyT7wOrmAieGbFTSp8S09g1ukYPLVsDSVQaAdOyNS9Pzr1Y3W0nXBmctuUPP-wRk0blypy2sA3w4DFOryozDTePalPXNfULHzQngmOKYytoLeflKxnSfDyfNcVeuDhd7XE81zE3t4AIoTBXS9F2Sqr18yFxwyHuzl65tme9UvPJ4gx070I" 
            />
            <ServiceRow 
              title="VIDEO FOR SOCIAL NETWORKS" 
              index="03" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBQZ1ADn92ebyyfd54LZFv7l91S-Kq4WQJiOBWEc-ptspN2LTQo-pQkfsH_rUqre0IIW_q3aNQhGk5iXFid3BCn7ytxINBC53PLn5LEnQJrG4mFA5lR2GT_Mzh7Qc4_ISQmdLHJsauBoRFkG7IuU8ToHjUCVwSBtcquVG8wOxpNV-b4YkYIYblUZ80frdlWo8ut9W3A2L6FdJT_O0QzgyMOnHrTgwrSqJQjivBbV2H3MP9TeWwv5dZZdk81DRlPP9_CiC3g0cTs3rk" 
            />
            <ServiceRow 
              title="MUSIC VIDEOS" 
              index="04" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-Kn0zyfgXLEbuBAfrKVbjsnmBedXcTHuxJdA8QbMPYvexg8E_bDSDmVALC79swsQVHbGojTci-QRn5-KUyp1HOcUC8YdJequkRlI1unNZHhDf32MNxImpTyzTJK5ilSZHAqvlnLDH4sQ92xnBeESl-c-0iX2h5Gd-Ar-xUpCo0zHb-0mPKnOJVLBGVg77aH5N6OP_GCu84mPiWFfdIh4zosnk5CSj0pTZNh7w3dVNhLXhvHZXK2T1K9t7drHjsO7DnDbRHA3tx0" 
            />
            <ServiceRow 
              title="DESTINATION TOURISM VIDEO" 
              index="05" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDv2uSRn-I_qwds0uAdciL9vmJSvjbQdtSBdaT97vO_aNEMhGOpaAvnsspnGz-oHkg9PutnA70DaeWQWgL4BKjnit4EUmyT7wOrmAieGbFTSp8S09g1ukYPLVsDSVQaAdOyNS9Pzr1Y3W0nXBmctuUPP-wRk0blypy2sA3w4DFOryozDTePalPXNfULHzQngmOKYytoLeflKxnSfDyfNcVeuDhd7XE81zE3t4AIoTBXS9F2Sqr18yFxwyHuzl65tme9UvPJ4gx070I" 
            />
            <ServiceRow 
              title="INTERVIEWS & EVENTS" 
              index="06" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBQZ1ADn92ebyyfd54LZFv7l91S-Kq4WQJiOBWEc-ptspN2LTQo-pQkfsH_rUqre0IIW_q3aNQhGk5iXFid3BCn7ytxINBC53PLn5LEnQJrG4mFA5lR2GT_Mzh7Qc4_ISQmdLHJsauBoRFkG7IuU8ToHjUCVwSBtcquVG8wOxpNV-b4YkYIYblUZ80frdlWo8ut9W3A2L6FdJT_O0QzgyMOnHrTgwrSqJQjivBbV2H3MP9TeWwv5dZZdk81DRlPP9_CiC3g0cTs3rk" 
            />
            <ServiceRow 
              title="GRAPHICS & ANIMATION" 
              index="07" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-Kn0zyfgXLEbuBAfrKVbjsnmBedXcTHuxJdA8QbMPYvexg8E_bDSDmVALC79swsQVHbGojTci-QRn5-KUyp1HOcUC8YdJequkRlI1unNZHhDf32MNxImpTyzTJK5ilSZHAqvlnLDH4sQ92xnBeESl-c-0iX2h5Gd-Ar-xUpCo0zHb-0mPKnOJVLBGVg77aH5N6OP_GCu84mPiWFfdIh4zosnk5CSj0pTZNh7w3dVNhLXhvHZXK2T1K9t7drHjsO7DnDbRHA3tx0" 
            />
            <ServiceRow 
              title="STILL PHOTOGRAPHY" 
              index="08" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDv2uSRn-I_qwds0uAdciL9vmJSvjbQdtSBdaT97vO_aNEMhGOpaAvnsspnGz-oHkg9PutnA70DaeWQWgL4BKjnit4EUmyT7wOrmAieGbFTSp8S09g1ukYPLVsDSVQaAdOyNS9Pzr1Y3W0nXBmctuUPP-wRk0blypy2sA3w4DFOryozDTePalPXNfULHzQngmOKYytoLeflKxnSfDyfNcVeuDhd7XE81zE3t4AIoTBXS9F2Sqr18yFxwyHuzl65tme9UvPJ4gx070I" 
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT FILUMED (Bio & Technical HUD) */}
      <section className="py-stack-xl px-margin-edge bg-[#050505] relative z-10" id="about">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-4">
            <ScrollReveal y={20}>
              <h2 className="font-sans text-3xl md:text-5xl text-primary font-bold border-l-4 border-primary-fixed pl-6 uppercase tracking-tight">ABOUT FILUMED</h2>
              <div className="mt-8 font-mono text-[10px] text-secondary leading-relaxed tracking-wider uppercase opacity-70">
                COORD_001.29.X<br />
                STUDIO_ORIGIN: MILAN / LONDON<br />
                EST_DATE: 2024
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-8 flex flex-col gap-8">
            <ScrollReveal y={25} delay={0.1}>
              <p className="font-mono text-sm md:text-lg text-on-background max-w-2xl leading-relaxed">
                We don't just capture light; we engineer attention. In a world saturated with digital noise, FILUMED was founded on the principle of aggressive clarity. 
                <br /><br />
                Our aesthetic is raw, technical, and uncompromising. We help brands move beyond the "commercial" into the "cinematic," creating visual narratives that don't just ask for attention—they demand it.
              </p>
            </ScrollReveal>

            <div className="h-[2px] w-full bg-primary-fixed" />

            <ScrollReveal y={20} delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter font-mono text-xs text-primary-fixed font-semibold tracking-wider">
                <div className="flex flex-col gap-2">
                  <span className="text-secondary text-[9px] tracking-widest opacity-60">[PRECISION]</span>
                  100% TECHNICAL ACCURACY
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-secondary text-[9px] tracking-widest opacity-60">[SCALE]</span>
                  GLOBAL PRODUCTION
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-secondary text-[9px] tracking-widest opacity-60">[VISION]</span>
                  ARTISTIC AUTHORITY
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-secondary text-[9px] tracking-widest opacity-60">[SPEED]</span>
                  AGILE WORKFLOWS
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: BTS (Behind The Scenes Grid) */}
      <section className="py-stack-xl px-margin-edge bg-[#0c0c0d] border-t border-b border-white/5 relative z-10" id="bts">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-gutter">
            <ScrollReveal y={15}>
              <h2 className="font-sans text-3xl md:text-5xl text-primary uppercase font-bold tracking-tight">BEHIND THE SCENES</h2>
            </ScrollReveal>
            <ScrollReveal y={15} delay={0.1}>
              <p className="font-mono text-[10px] text-secondary md:text-right max-w-[200px] uppercase tracking-widest opacity-70">
                THE GEAR. THE PROCESS. THE GRIT.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit mt-8">
            <ScrollReveal y={25} delay={0.0}>
              <div className="group relative aspect-square overflow-hidden border border-outline-variant">
                <img 
                  alt="Camera calibration" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-Kn0zyfgXLEbuBAfrKVbjsnmBedXcTHuxJdA8QbMPYvexg8E_bDSDmVALC79swsQVHbGojTci-QRn5-KUyp1HOcUC8YdJequkRlI1unNZHhDf32MNxImpTyzTJK5ilSZHAqvlnLDH4sQ92xnBeESl-c-0iX2h5Gd-Ar-xUpCo0zHb-0mPKnOJVLBGVg77aH5N6OP_GCu84mPiWFfdIh4zosnk5CSj0pTZNh7w3dVNhLXhvHZXK2T1K9t7drHjsO7DnDbRHA3tx0" 
                />
                <div className="absolute bottom-4 left-4 font-mono text-[9px] bg-[#050505] text-primary px-3 py-1.5 border border-white/5 uppercase tracking-wider">
                  SCENE_01 / LENS_CALIBRATION
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal y={25} delay={0.1}>
              <div className="group relative aspect-square overflow-hidden border border-outline-variant">
                <img 
                  alt="Lighting rig" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv2uSRn-I_qwds0uAdciL9vmJSvjbQdtSBdaT97vO_aNEMhGOpaAvnsspnGz-oHkg9PutnA70DaeWQWgL4BKjnit4EUmyT7wOrmAieGbFTSp8S09g1ukYPLVsDSVQaAdOyNS9Pzr1Y3W0nXBmctuUPP-wRk0blypy2sA3w4DFOryozDTePalPXNfULHzQngmOKYytoLeflKxnSfDyfNcVeuDhd7XE81zE3t4AIoTBXS9F2Sqr18yFxwyHuzl65tme9UvPJ4gx070I" 
                />
                <div className="absolute bottom-4 left-4 font-mono text-[9px] bg-[#050505] text-primary px-3 py-1.5 border border-white/5 uppercase tracking-wider">
                  SCENE_04 / LIGHT_RIGGING
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal y={25} delay={0.2}>
              <div className="group relative aspect-square overflow-hidden border border-outline-variant">
                <img 
                  alt="Post processing" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQZ1ADn92ebyyfd54LZFv7l91S-Kq4WQJiOBWEc-ptspN2LTQo-pQkfsH_rUqre0IIW_q3aNQhGk5iXFid3BCn7ytxINBC53PLn5LEnQJrG4mFA5lR2GT_Mzh7Qc4_ISQmdLHJsauBoRFkG7IuU8ToHjUCVwSBtcquVG8wOxpNV-b4YkYIYblUZ80frdlWo8ut9W3A2L6FdJT_O0QzgyMOnHrTgwrSqJQjivBbV2H3MP9TeWwv5dZZdk81DRlPP9_CiC3g0cTs3rk" 
                />
                <div className="absolute bottom-4 left-4 font-mono text-[9px] bg-[#050505] text-primary px-3 py-1.5 border border-white/5 uppercase tracking-wider">
                  SCENE_07 / POST_PROCESSING
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 5: CONTACT */}
      <section className="py-stack-xl px-margin-edge bg-[#050505] relative z-10 border-t border-outline-variant" id="contact">
        <div className="max-w-container-max mx-auto text-center">
          <ScrollReveal y={30}>
            <h2 className="font-sans text-[48px] md:text-[80px] font-bold text-primary mb-stack-md leading-none tracking-tighter uppercase">LET'S MAKE THEM LISTEN</h2>
          </ScrollReveal>
          
          <ScrollReveal y={30} delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md text-left mb-stack-md border-t border-b border-outline-variant py-12">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-secondary tracking-widest uppercase opacity-75">[CONNECT]</span>
                <a className="font-sans text-xl md:text-2xl font-bold text-primary hover:text-primary-fixed transition-colors" href="mailto:hello@filumed.com">HELLO@FILUMED.COM</a>
                <a className="font-mono text-sm text-secondary hover:text-primary transition-colors" href="tel:+1234567890">+123 456 7890</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-secondary tracking-widest uppercase opacity-75">[LOCATION]</span>
                <p className="font-mono text-sm text-primary leading-relaxed">STUDIO 42, THE GRID<br />CREATIVE QUARTER, MI</p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-secondary tracking-widest uppercase opacity-75">[FOLLOW]</span>
                <div className="flex gap-6 font-mono text-xs font-semibold">
                  <a className="text-primary hover:text-primary-fixed transition-colors" href="#">INSTAGRAM</a>
                  <a className="text-primary hover:text-primary-fixed transition-colors" href="#">VIMEO</a>
                  <a className="text-primary hover:text-primary-fixed transition-colors" href="#">LINKEDIN</a>
                </div>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal y={20} delay={0.2}>
            <motion.button 
              className="w-full bg-primary-fixed text-[#050505] font-sans font-bold text-xl py-12 hover:bg-white transition-all group flex items-center justify-center gap-8 border-4 border-primary-fixed hover:border-white"
              onClick={() => handleLinkClick('contact')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              START YOUR CAMPAIGN
              <span className="material-symbols-outlined text-[48px] md:text-[64px] group-hover:translate-x-4 transition-transform">arrow_right_alt</span>
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-margin-edge py-stack-md flex flex-col md:flex-row justify-between items-end border-t border-outline-variant relative z-10 bg-[#000000]">
        <div className="flex flex-col items-start gap-2">
          <span className="font-sans text-[20px] font-bold text-on-background uppercase tracking-tighter">FILUMED</span>
          <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">© 2024 FILUMED PRODUCTION. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex gap-8 mt-6 md:mt-0 font-mono text-[10px] text-secondary">
          <a className="hover:text-primary-fixed underline-offset-4 hover:underline" href="#">PRIVACY POLICY</a>
          <a className="hover:text-primary-fixed underline-offset-4 hover:underline" href="#">TERMS OF SERVICE</a>
        </div>
      </footer>
    </div>
  );
}

// --- WORK PAGE COMPONENT ---

function WorkPage({ onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (!drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const categories = [
    'ALL',
    'FILM & DOCUMENTARY',
    'TV COMMERCIALS',
    'MUSIC VIDEOS'
  ];

  const filteredProjects = activeFilter === 'ALL'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  // Drawer Animation variants
  const navContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 30, skewY: -3 },
    visible: { 
      opacity: 1, 
      x: 0, 
      skewY: 0,
      transition: { type: "spring", stiffness: 150, damping: 20 }
    }
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen relative overflow-hidden">
      
      {/* Top Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-edge py-4 bg-[#050505]/90 backdrop-blur-md border-b border-outline-variant"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="font-sans text-xl md:text-[24px] font-bold text-primary-fixed uppercase tracking-tighter cursor-pointer select-none"
          onClick={() => { document.body.style.overflow = 'auto'; onNavigate('home'); }}
        >
          FILUMED PRODUCTION
        </div>
        <button 
          className="material-symbols-outlined text-primary-fixed text-4xl hover:scale-95 transition-transform" 
          onClick={toggleDrawer}
        >
          menu
        </button>
      </motion.nav>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            className="fixed inset-0 z-[60] flex flex-col justify-center p-margin-edge bg-[#050505] border-l border-outline-variant" 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            id="drawer"
          >
            <button 
              className="absolute top-4 right-margin-edge material-symbols-outlined text-4xl text-primary-fixed" 
              onClick={toggleDrawer}
            >
              close
            </button>
            <motion.div 
              className="space-y-8"
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={navItemVariants} className="mb-12">
                <h2 className="font-sans text-4xl font-bold text-primary-fixed uppercase">FILUMED</h2>
                <p className="font-mono text-xs text-secondary opacity-60">EST. 2024</p>
              </motion.div>
              <motion.div className="flex flex-col gap-6" variants={navContainerVariants}>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl font-bold text-primary-fixed border-l-4 border-primary-fixed pl-4 hover:bg-surface-container-high transition-all text-left uppercase"
                  onClick={() => { toggleDrawer(); }}
                >
                  WORK
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl font-bold text-on-background pl-4 hover:bg-surface-container-high hover:text-primary-fixed transition-all text-left uppercase"
                  onClick={() => { toggleDrawer(); onNavigate('home'); }}
                >
                  HOME
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl font-bold text-on-background pl-4 hover:bg-surface-container-high hover:text-primary-fixed transition-all text-left uppercase"
                  onClick={() => { toggleDrawer(); onNavigate('home'); setTimeout(() => {
                    const meetEl = document.getElementById('services');
                    if (meetEl) meetEl.scrollIntoView({ behavior: 'smooth' });
                  }, 100); }}
                >
                  SERVICES
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl font-bold text-on-background pl-4 hover:bg-surface-container-high hover:text-primary-fixed transition-all text-left uppercase"
                  onClick={() => { toggleDrawer(); onNavigate('home'); setTimeout(() => {
                    const btsEl = document.getElementById('bts');
                    if (btsEl) btsEl.scrollIntoView({ behavior: 'smooth' });
                  }, 100); }}
                >
                  STUDIO
                </motion.button>
                <motion.button 
                  variants={navItemVariants}
                  className="font-sans text-3xl font-bold text-on-background pl-4 hover:bg-surface-container-high hover:text-primary-fixed transition-all text-left uppercase"
                  onClick={() => { toggleDrawer(); onNavigate('home'); setTimeout(() => {
                    const contactEl = document.getElementById('contact');
                    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                  }, 100); }}
                >
                  CONTACT
                </motion.button>
              </motion.div>
              <motion.button 
                variants={navItemVariants}
                className="mt-12 bg-primary-fixed text-[#050505] px-8 py-4 font-mono text-xs font-bold hover:bg-white hover:text-black transition-colors uppercase text-left"
                onClick={() => { toggleDrawer(); onNavigate('home'); setTimeout(() => {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }, 100); }}
              >
                START PROJECT
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-stack-md relative z-10">
        {/* Hero Section */}
        <header className="px-margin-edge py-stack-md border-b border-outline-variant max-w-container-max mx-auto">
          <div className="flex flex-col gap-2">
            <motion.div 
              className="font-mono text-[10px] text-primary-fixed uppercase tracking-widest mb-4"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              [ COLLECTION_INDEX_04 // WORKS ]
            </motion.div>
            <div className="overflow-hidden py-1">
              <motion.h1 
                className="font-sans text-[48px] md:text-[120px] font-bold text-primary tracking-tighter leading-none uppercase"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                OUR WORK
              </motion.h1>
            </div>
            <div className="h-1 bg-primary-fixed w-32 mt-4" />
            <motion.p 
              className="mt-8 font-mono text-sm text-secondary max-w-xl leading-relaxed uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              WE DON'T JUST MAKE VIDEOS. WE MAKE PEOPLE LISTEN.
            </motion.p>
          </div>
        </header>

        {/* Filters Section */}
        <section className="border-b border-outline-variant overflow-x-auto hide-scrollbar">
          <div className="flex items-center px-margin-edge py-6 whitespace-nowrap gap-4 max-w-container-max mx-auto">
            {categories.map((cat, index) => (
              <motion.button 
                key={index} 
                className={`font-mono text-[11px] font-semibold px-6 py-2 border uppercase transition-all tracking-wider ${activeFilter === cat ? 'bg-primary-fixed text-[#050505] border-primary-fixed' : 'text-secondary border-outline hover:border-primary-fixed hover:text-primary-fixed'}`}
                onClick={() => handleFilterClick(cat)}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Main Work Grid */}
        <motion.section 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-container-max mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 3).map((project) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                key={project.id} 
                className="group relative border border-outline-variant transition-all duration-300 hover:border-primary-fixed cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden">
                    <motion.img 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105" 
                      src={project.img} 
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="p-8">
                    <span className="inline-block bg-primary-fixed text-[#050505] font-mono text-[10px] font-bold px-2 py-1 mb-4 uppercase">{project.badge}</span>
                    <h3 className="font-sans text-xl md:text-2xl font-bold text-primary mb-2 uppercase tracking-tight">{project.title}</h3>
                    <p className="font-mono text-[11px] text-secondary opacity-60 uppercase">{project.desc}</p>
                  </div>
                </div>
                {/* Visual View Project Overlay */}
                <div className="absolute inset-0 bg-primary-fixed/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 pointer-events-none">
                  <span className="font-mono text-sm text-[#050505] font-bold tracking-wider">→ VIEW PROJECT</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* Category Section: TV Commercials horizontal carousel */}
        <section className="py-stack-md border-t border-outline-variant max-w-container-max mx-auto mt-12">
          <div className="px-margin-edge flex items-center justify-between mb-8">
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-primary uppercase">→ TV COMMERCIALS</h2>
            <div className="hidden md:block h-px bg-outline-variant flex-grow mx-12"></div>
            <button 
              onClick={() => handleFilterClick('TV COMMERCIALS')}
              className="font-mono text-xs text-primary-fixed font-bold hover:underline"
            >
              EXPLORE CATEGORY
            </button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-8 px-margin-edge pb-6">
            <div className="min-w-[320px] md:min-w-[480px] group cursor-pointer">
              <div className="aspect-[16/9] border border-outline-variant group-hover:border-primary-fixed overflow-hidden transition-all bg-zinc-950">
                <img 
                  alt="Mercury auto group" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLsk3drb0Tv_ZZFS4ce_g6Xp3lpqA7bXZapnQF_p3U1kihq-Eg5G3DqX8CDI8Gp6pkZcOKCfOLjxZg3CIPrP-39JeZh9UpDVPWViAFaUR6rqpMiFMddNLKh9La534llNQXLd3x4rTTRaHUG8cftwv15eOiPW2XFvpu5TXdWOYM4KA1hXuu8x3dDJ3Ayf-Ss-6ycoPcU9ctWZ9T2O17wpK-486uRwcmUsbD26TzNaM0XVxJOLbhYTSkPwLhc" 
                />
              </div>
              <div className="py-4 font-mono">
                <h4 className="text-xs text-primary uppercase font-bold">MERCURY AUTO GROUP</h4>
                <p className="text-[10px] text-secondary mt-1">PROD_ID: COM_772</p>
              </div>
            </div>

            <div className="min-w-[320px] md:min-w-[480px] group cursor-pointer">
              <div className="aspect-[16/9] border border-outline-variant group-hover:border-primary-fixed overflow-hidden transition-all bg-zinc-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#353535] group-hover:text-primary-fixed text-6xl transition-colors">play_circle</span>
              </div>
              <div className="py-4 font-mono">
                <h4 className="text-xs text-primary uppercase font-bold">URBAN APPAREL SPRING</h4>
                <p className="text-[10px] text-secondary mt-1">PROD_ID: COM_910</p>
              </div>
            </div>

            <div className="min-w-[320px] md:min-w-[480px] group cursor-pointer">
              <div className="aspect-[16/9] border border-outline-variant group-hover:border-primary-fixed overflow-hidden transition-all bg-zinc-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#353535] group-hover:text-primary-fixed text-6xl transition-colors">play_circle</span>
              </div>
              <div className="py-4 font-mono">
                <h4 className="text-xs text-primary uppercase font-bold">TECHNO LOGISTICS GLOBAL</h4>
                <p className="text-[10px] text-secondary mt-1">PROD_ID: COM_443</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-fixed text-[#050505] px-margin-edge py-stack-xl flex flex-col md:flex-row justify-between items-center gap-12 max-w-container-max mx-auto mt-16">
          <ScrollReveal y={20}>
            <div>
              <h2 className="font-sans text-4xl font-bold uppercase leading-tight mb-4 text-[#050505]">READY TO MAKE<br />SOME NOISE?</h2>
              <p className="font-mono text-xs max-w-md text-neutral-800 uppercase leading-relaxed font-semibold">Our production slate is filling fast for Q3 2024. Secure your slot now to ensure high-fidelity delivery.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal y={20} delay={0.1}>
            <motion.button 
              className="w-full md:w-auto px-12 py-8 bg-[#050505] text-primary-fixed font-sans font-bold text-lg uppercase border-4 border-[#050505] hover:bg-transparent hover:text-[#050505] transition-all"
              onClick={() => onNavigate('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START YOUR CAMPAIGN →
            </motion.button>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-margin-edge py-stack-md flex flex-col md:flex-row justify-between items-end border-t border-outline-variant relative z-10 max-w-container-max mx-auto mt-16 bg-[#000000]">
        <div className="flex flex-col gap-4">
          <div className="font-sans text-xl text-on-background uppercase font-bold tracking-tighter">
            FILUMED
          </div>
          <p className="font-mono text-[10px] text-secondary">
            © 2024 FILUMED PRODUCTION. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex flex-col items-end gap-6 mt-8 md:mt-0">
          <div className="flex gap-8 font-mono text-xs font-semibold">
            <a className="text-secondary hover:text-primary-fixed transition-all" href="#">INSTAGRAM</a>
            <a className="text-secondary hover:text-primary-fixed transition-all" href="#">VIMEO</a>
            <a className="text-secondary hover:text-primary-fixed transition-all" href="#">LINKEDIN</a>
          </div>
          <div className="font-mono text-[10px] text-outline uppercase tracking-[0.2em]">
            COORD: 34.0522° N, 118.2437° W // HQ
          </div>
        </div>
      </footer>
    </div>
  );
}
