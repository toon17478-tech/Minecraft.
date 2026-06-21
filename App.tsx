import { useRef, useEffect } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleHUD } from './components/PuzzleHUD';
import { usePuzzleStore, FOOD_DATA } from './store';
import { useParticles, ParticleLayer } from './components/Particles';
import { useScorePopups, ScorePopups } from './components/ScorePopup';
import { useConfetti, ConfettiLayer } from './components/Confetti';
import './index.css';

function App() {
  const gameStarted = usePuzzleStore((s) => s.gameStarted);
  const score = usePuzzleStore((s) => s.score);
  const combo = usePuzzleStore((s) => s.combo);
  const lastMatchTypes = usePuzzleStore((s) => s.lastMatchTypes);
  const showLevelComplete = usePuzzleStore((s) => s.showLevelComplete);
  const { particles, emit } = useParticles();
  const { popups, addPopup } = useScorePopups();
  const { pieces: confettiPieces, celebrate, rain } = useConfetti();
  const prevMatchRef = useRef('');
  const prevScoreRef = useRef(0);
  const prevLevelCompleteRef = useRef(false);

  useEffect(() => {
    const matchKey = lastMatchTypes.join(',');
    if (matchKey && matchKey !== prevMatchRef.current && lastMatchTypes.length > 0) {
      prevMatchRef.current = matchKey;
      const colors = lastMatchTypes.map(t => FOOD_DATA[t]?.color || '#f59e0b');
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      emit(
        centerX + (Math.random() - 0.5) * 150, 
        centerY + (Math.random() - 0.5) * 100, 
        colors, 
        15 + lastMatchTypes.length * 2
      );
    }
  }, [lastMatchTypes, emit]);

  useEffect(() => {
    if (score > prevScoreRef.current && prevScoreRef.current > 0) {
      const gained = score - prevScoreRef.current;
      const comboText = combo > 1 ? ` x${combo}` : '';
      const msgs = ['Chatpata!', 'Mazedaar!', 'Kya Baat!', 'Zabardast!', 'Jhakaas!'];
      const msg = combo > 2 ? msgs[Math.min(combo - 1, msgs.length - 1)] : '';
      addPopup(
        window.innerWidth / 2 - 40,
        window.innerHeight / 2 - 60,
        `+${gained}${comboText} ${msg}`,
        combo > 2 ? '#fbbf24' : '#ffffff'
      );
      // Confetti on big combos
      if (combo >= 3) {
        celebrate(window.innerWidth / 2, window.innerHeight / 2, combo * 8);
      }
    }
    prevScoreRef.current = score;
  }, [score, combo, addPopup, celebrate]);

  // Confetti rain on level complete
  useEffect(() => {
    if (showLevelComplete && !prevLevelCompleteRef.current) {
      rain();
    }
    prevLevelCompleteRef.current = showLevelComplete;
  }, [showLevelComplete, rain]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a0c04 0%, #2d1a0e 30%, #1a0c04 70%, #0f0704 100%)',
      }}
    >
      {/* Indian-themed ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Warm glow spots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.06), transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(234,88,12,0.05), transparent)',
            filter: 'blur(50px)',
          }}
        />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.04), transparent)',
            filter: 'blur(50px)',
          }}
        />
        
        {/* Decorative mandala-like pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] animate-spin-slow opacity-[0.02]">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500" />
          <div className="absolute inset-8 rounded-full border border-amber-500" />
          <div className="absolute inset-16 rounded-full border border-amber-500" />
          <div className="absolute inset-24 rounded-full border border-amber-500" />
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 rotate-45" />
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 rotate-90" />
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 rotate-135" />
        </div>
        
        {/* Subtle Diya/lantern dots */}
        {[
          { left: '8%', top: '15%', delay: '0s', size: '3px' },
          { left: '92%', top: '20%', delay: '1s', size: '2px' },
          { left: '5%', top: '70%', delay: '2s', size: '2px' },
          { left: '95%', top: '65%', delay: '0.5s', size: '3px' },
          { left: '15%', top: '85%', delay: '1.5s', size: '2px' },
          { left: '85%', top: '80%', delay: '2.5s', size: '2px' },
        ].map((dot, i) => (
          <div 
            key={i} 
            className="absolute rounded-full animate-pulse"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              background: '#fbbf24',
              boxShadow: '0 0 8px #fbbf24, 0 0 20px rgba(251,191,36,0.3)',
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>
      
      {/* Effects */}
      <ParticleLayer particles={particles} />
      <ScorePopups popups={popups} />
      <ConfettiLayer pieces={confettiPieces} />
      
      {/* HUD */}
      <div className="w-full max-w-lg relative z-10 mb-3">
        <PuzzleHUD />
      </div>
      
      {/* Game Board */}
      {gameStarted && (
        <div className="relative z-10">
          <PuzzleBoard />
        </div>
      )}
      
      {/* Bottom info */}
      {gameStarted && (
        <div className="mt-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: 'rgba(120,53,15,0.3)',
              border: '1px solid rgba(245,158,11,0.1)',
            }}
          >
            <span className="text-amber-400/40 text-xs">🔄 Do food items ko swap karo • 3 ya zyada match karo</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
