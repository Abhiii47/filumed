import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════ */

/** Chrome shimmer gradient text */
function ChromeText({ children }) {
  return (
    <span
      style={{
        background:
          'linear-gradient(125deg,#fff 0%,#c0c0c0 20%,#fff 40%,#888 60%,#fff 80%,#bbb 100%)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'heroChromeSweep 5s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  );
}

/** Ghost / outline text */
function GhostText({ children }) {
  return (
    <span
      style={{
        WebkitTextStroke: '1.5px rgba(255,255,255,0.28)',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {children}
    </span>
  );
}

/** Single headline line — clips upward on enter */
function TitleRow({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden leading-none">
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

/** Glossy stat card with 3-D tilt on hover */
function StatCard({ number, label, delay = 0 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 18;
    ref.current.style.transform = `translateY(-5px) rotateY(${x}deg) rotateX(${-y}deg)`;
  };
  const handleLeave = () => {
    ref.current.style.transform = '';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        padding: '18px 26px',
        minWidth: '90px',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '4px',
        backdropFilter: 'blur(14px)',
        textAlign: 'center',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'border-color .3s, box-shadow .35s',
      }}
      whileHover={{
        borderColor: 'rgba(255,255,255,0.22)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      }}
    >
      {/* top gloss line */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: '10px',
          right: '10px',
          height: '1px',
          background:
            'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)',
        }}
      />
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
          lineHeight: 1,
          marginBottom: '5px',
          background: 'linear-gradient(180deg,#fff 0%,#888 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: '9px',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/** Continuous ticker strip */
function HeroTicker() {
  const items = [
    'Film Production','·','Music Videos','·',
    'TV Commercials','·','Documentaries','·',
    'Brand Content','·','Short Films','·',
  ];
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '13px 0',
      }}
    >
      <motion.div
        className="flex gap-11 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        style={{ willChange: 'transform' }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            style={{
              fontSize: '10px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              flexShrink: 0,
              userSelect: 'none',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════ */
export default function HeroSection({ onNavigate }) {
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* nav links */
  const navLinks = ['WORK', 'SERVICES', 'ABOUT', 'CONTACT'];

  return (
    <>
      {/* ── keyframes injected once ── */}
      <style>{`
        @keyframes heroChromeSweep {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes heroLedPulse {
          0%,100% { opacity:1; box-shadow: 0 0 0 0   rgba(255,255,255,.4); }
          50%     { opacity:.5; box-shadow: 0 0 0 5px rgba(255,255,255,0); }
        }
        @keyframes heroScanDown {
          0%   { top:-1px; opacity:0; }
          5%   { opacity:1; }
          95%  { opacity:1; }
          100% { top:100%; opacity:0; }
        }
        @keyframes heroSpotSway {
          0%   { transform: translateX(-50%) rotate(-4deg); }
          100% { transform: translateX(-50%) rotate( 4deg); }
        }
        @keyframes heroChromeLine {
          from { clip-path:inset(0 100% 0 0); opacity:0; }
          to   { clip-path:inset(0 0%   0 0); opacity:1; }
        }
        @keyframes heroScrollPulse {
          0%,100% { height:14px; opacity:.3; }
          50%     { height:44px; opacity:.9; }
        }
      `}</style>

      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#030303',
        }}
      >
        {/* ── Mouse spotlight ── */}
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1,
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 60%)',
            left: mouse.x,
            top: mouse.y,
            transform: 'translate(-50%,-50%)',
            transition: 'left .08s linear, top .08s linear',
          }}
        />

        {/* ── Faint grid ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%,#000 40%,transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%,#000 40%,transparent 100%)',
          }}
        />

        {/* ── Spotlight cone ── */}
        <div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              width: '140%',
              height: '900px',
              background:
                'conic-gradient(from 270deg at 50% 0%,transparent 70deg,rgba(255,255,255,0.04) 85deg,rgba(255,255,255,0.07) 90deg,rgba(255,255,255,0.04) 95deg,transparent 110deg)',
              animation: 'heroSpotSway 10s ease-in-out infinite alternate',
            }}
          />
        </div>

        {/* ── Chrome top edge line ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 25%,rgba(255,255,255,1) 50%,rgba(255,255,255,0.6) 75%,transparent 100%)',
            animation: 'heroChromeLine 1.5s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}
        />

        {/* ── CRT scan line ── */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent)',
            animation: 'heroScanDown 8s linear infinite',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        {/* ── Cinematic corner brackets ── */}
        {[
          { pos: { top: 64, left: 64 },   hDir: 'left',  vDir: 'top'    },
          { pos: { top: 64, right: 64 },  hDir: 'right', vDir: 'top'    },
          { pos: { bottom: 72, left: 64 },  hDir: 'left',  vDir: 'bottom' },
          { pos: { bottom: 72, right: 64 }, hDir: 'right', vDir: 'bottom' },
        ].map(({ pos, hDir, vDir }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 + i * 0.1 }}
            style={{
              position: 'absolute',
              width: 22, height: 22,
              zIndex: 20, pointerEvents: 'none',
              ...pos,
            }}
          >
            <div style={{ position:'absolute', width:'1px', height:'100%', background:'rgba(255,255,255,0.3)', [hDir]: 0 }} />
            <div style={{ position:'absolute', height:'1px', width:'100%', background:'rgba(255,255,255,0.3)', [vDir]: 0 }} />
          </motion.div>
        ))}

        {/* ── Film counter (right side decoration) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="hidden lg:block"
          style={{
            position: 'absolute', right: 48, top: '50%',
            transform: 'translateY(-50%)', zIndex: 10, textAlign: 'right',
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: '5.5rem', lineHeight: 1, letterSpacing: '.06em',
              background:
                'linear-gradient(180deg,rgba(255,255,255,.1) 0%,rgba(255,255,255,.03) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            001
          </div>
          <div
            style={{
              fontSize: '8.5px', letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.1)',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            FRAME INDEX
          </div>
        </motion.div>

        {/* ── Scroll cue (left bottom) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="hidden md:flex flex-col items-center gap-2"
          style={{ position: 'absolute', bottom: 88, left: 64, zIndex: 10 }}
        >
          <div
            style={{
              width: '1px',
              background:
                'linear-gradient(180deg,rgba(255,255,255,.6) 0%,transparent 100%)',
              animation: 'heroScrollPulse 2.2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '8.5px', letterSpacing: '.26em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,.18)',
              writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            Scroll
          </span>
        </motion.div>

        {/* ══════ NAVBAR ══════ */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 flex items-center justify-between"
          style={{ padding: '32px 72px' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              style={{
                position: 'relative', width: 38, height: 38,
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: 3,
                background: 'linear-gradient(135deg,#111 0%,#1e1e1e 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background:
                    'linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)',
                }}
              />
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="4" stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" />
                <circle cx="11" cy="11" r="1.2" fill="rgba(255,255,255,0.9)" />
                <rect x="2"    y="3"    width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)" />
                <rect x="17.8" y="3"    width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)" />
                <rect x="2"    y="15.8" width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)" />
                <rect x="17.8" y="15.8" width="2.2" height="3.2" rx="0.4" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: '1.55rem', letterSpacing: '.18em', color: '#fff',
              }}
            >
              FILUMED
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex gap-10">
            {navLinks.map((l) => (
              <button
                key={l}
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '10.5px', letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.35)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color .25s',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'rgba(255,255,255,.9)')}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,.35)')}
              >
                {l}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            style={{
              position: 'relative', overflow: 'hidden',
              padding: '13px 34px',
              background:
                'linear-gradient(160deg,#1a1a1a 0%,#252525 60%,#181818 100%)',
              border: '1px solid rgba(255,255,255,.14)',
              borderRadius: 2,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '10px', letterSpacing: '.22em',
              textTransform: 'uppercase', color: '#fff',
              cursor: 'pointer',
              transition: 'border-color .3s, box-shadow .3s, transform .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 0 28px rgba(255,255,255,.07),0 4px 20px rgba(0,0,0,.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            {/* top gloss */}
            <span
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)',
              }}
            />
            Start Project
          </button>
        </motion.nav>

        {/* ══════ HERO BODY ══════ */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex-1 flex flex-col"
          css={{ padding: '28px 72px 52px' }}
          // inline fallback for padding
          // (Tailwind class below handles it)
        >
          <div style={{ padding: '28px 72px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '7px 16px',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 999,
                background: 'rgba(255,255,255,.03)',
                backdropFilter: 'blur(16px)',
                width: 'fit-content',
                marginBottom: 36,
              }}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#fff',
                  display: 'block',
                  animation: 'heroLedPulse 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: '10px', letterSpacing: '.2em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,.55)',
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                Est. 2019 · Award-Winning Studio
              </span>
            </motion.div>

            {/* ── HEADLINE ── */}
            <h1
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(5rem,16vw,15rem)',
                lineHeight: 0.86,
                letterSpacing: '.015em',
                textTransform: 'uppercase',
                marginBottom: 48,
              }}
            >
              <TitleRow delay={0.65}>
                <span style={{ color: '#fff' }}>WE MAKE</span>
              </TitleRow>
              <TitleRow delay={0.8}>
                <ChromeText>CINEMA</ChromeText>
              </TitleRow>
              <TitleRow delay={0.95}>
                <GhostText>HAPPEN.</GhostText>
              </TitleRow>
            </h1>

            {/* ── BOTTOM ROW ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-end justify-between gap-10 flex-wrap"
            >
              {/* Description + CTA */}
              <div style={{ maxWidth: 340 }}>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '11px', lineHeight: 1.9,
                    letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,.32)',
                    marginBottom: 24,
                  }}
                >
                  From brand commercials to feature documentaries — we craft
                  visual stories that demand attention.
                </p>
                <button
                  onClick={() => onNavigate?.('work')}
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '10.5px', letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,.85)',
                    background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,.22)',
                    paddingBottom: 3, cursor: 'pointer',
                    transition: 'color .25s, border-color .25s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'rgba(255,255,255,.85)';
                    e.target.style.borderColor = 'rgba(255,255,255,.22)';
                  }}
                >
                  View Our Work →
                </button>
              </div>

              {/* Stat cards */}
              <div className="hidden sm:flex gap-2.5">
                <StatCard number="120+" label="Projects" delay={1.1} />
                <StatCard number="8"    label="Awards"   delay={1.2} />
                <StatCard number="5"    label="Years"    delay={1.3} />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* ── Divider line reveal ── */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1px',
            background: 'rgba(255,255,255,.07)',
            margin: '0 72px',
          }}
        />

        {/* ── Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <HeroTicker />
        </motion.div>

      </section>
    </>
  );
}
