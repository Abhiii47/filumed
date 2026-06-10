import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   ATOM — Title Row (clip reveal per line)
═══════════════════════════════════════════════════ */
function TitleRow({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '108%', rotate: 1.5, opacity: 0 }}
        animate={{ y: '0%', rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   ATOM — Glossy Stat Card (3D tilt on hover)
═══════════════════════════════════════════════════ */
function StatCard({ number, label, delay = 0 }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 18;
    ref.current.style.transform = `translateY(-5px) rotateY(${x}deg) rotateX(${-y}deg)`;
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={() => { ref.current.style.transform = ''; }}
      className="stat-glass"
    >
      <span className="stat-gloss-line" />
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT — HeroSection
═══════════════════════════════════════════════════ */
export default function HeroSection({ onNavigate, onOpenNav }) {
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY       = useTransform(scrollYProgress, [0, 1],    ['0%',  '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1,      0  ]);

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={heroRef} className="hero-root" id="hero">

      {/* Mouse spotlight */}
      <div className="mouse-spotlight" style={{ left: mouse.x, top: mouse.y }} aria-hidden="true" />

      {/* 72px grid bg */}
      <div className="hero-grid" aria-hidden="true" />

      {/* Conic spotlight cone */}
      <div className="spotlight-wrap" aria-hidden="true"><div className="spotlight-cone" /></div>

      {/* Chrome top-edge line */}
      <motion.div
        className="chrome-top-line"
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% 0 0)',   opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      {/* Scan line */}
      <div className="scan-line" aria-hidden="true" />

      {/* Corner brackets */}
      {['tl', 'tr', 'bl', 'br'].map((pos, i) => (
        <motion.div key={pos} className={`corner-bracket corner-${pos}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8 + i * 0.1 }} aria-hidden="true"
        >
          <span className="corner-v" /><span className="corner-h" />
        </motion.div>
      ))}

      {/* Film counter */}
      <motion.div className="film-counter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} aria-hidden="true">
        <span className="film-counter-num">001</span>
        <span className="film-counter-lbl">FRAME INDEX</span>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} aria-hidden="true">
        <span className="scroll-cue-line" />
        <span className="scroll-cue-lbl">Scroll</span>
      </motion.div>

      {/* ── NAVBAR ── */}
      <motion.nav className="hero-nav"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="logo-btn" onClick={() => onNavigate('home')}>
          <span className="logo-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="4"   stroke="rgba(255,255,255,0.9)" strokeWidth="0.8"/>
              <circle cx="11" cy="11" r="1.2" fill="rgba(255,255,255,0.9)"/>
              <rect x="2"    y="3"    width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)"/>
              <rect x="17.8" y="3"    width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)"/>
              <rect x="2"    y="15.8" width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)"/>
              <rect x="17.8" y="15.8" width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)"/>
            </svg>
          </span>
          <span className="logo-wordmark">FILUMED</span>
        </button>

        <div className="hero-nav-links">
          {['WORK', 'SERVICES', 'STUDIO', 'ABOUT', 'CONTACT'].map((link) => (
            <button key={link} className="hero-nav-link" onClick={() => onOpenNav && onOpenNav(link)}>{link}</button>
          ))}
        </div>

        <button className="btn-glossy" onClick={() => onNavigate('contact')}>
          <span className="btn-glossy-top"   aria-hidden="true" />
          <span className="btn-glossy-sweep" aria-hidden="true" />
          START PROJECT
        </button>
      </motion.nav>

      {/* ── HERO BODY ── */}
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-body">

        {/* Status badge */}
        <motion.div className="status-badge"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="badge-led" aria-hidden="true" />
          <span className="badge-text">EST. 2019 · AWARD-WINNING STUDIO</span>
        </motion.div>

        {/* 3-layer headline */}
        <h1 className="hero-headline">
          <TitleRow delay={0.65}><span className="txt-white">WE MAKE</span></TitleRow>
          <TitleRow delay={0.80}><span className="txt-chrome">CINEMA</span></TitleRow>
          <TitleRow delay={0.95}><span className="txt-ghost">HAPPEN.</span></TitleRow>
        </h1>

        {/* Bottom row */}
        <motion.div className="hero-bottom"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-desc">
            <p>From brand commercials to feature documentaries &mdash; we craft visual stories that demand attention.</p>
            <button className="hero-desc-cta" onClick={() => onNavigate('work')}>VIEW OUR WORK &rarr;</button>
          </div>
          <div className="stats-row">
            <StatCard number="120+" label="PROJECTS" delay={1.10} />
            <StatCard number="8"    label="AWARDS"   delay={1.20} />
            <StatCard number="5"    label="YEARS"    delay={1.30} />
          </div>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <motion.div className="hero-divider"
        initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      {/* Ticker */}
      <motion.div className="ticker-strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} aria-hidden="true">
        <div className="ticker-track">
          {['Film Production','·','Music Videos','·','TV Commercials','·','Documentaries','·','Brand Content','·','Short Films','·',
            'Film Production','·','Music Videos','·','TV Commercials','·','Documentaries','·','Brand Content','·','Short Films','·'
          ].map((t, i) => <span key={i} className="ticker-item">{t}</span>)}
        </div>
      </motion.div>

    </section>
  );
}
