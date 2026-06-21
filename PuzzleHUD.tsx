import { usePuzzleStore, FOOD_DATA } from '../store';

export function PuzzleHUD() {
  const score = usePuzzleStore((s) => s.score);
  const level = usePuzzleStore((s) => s.level);
  const moves = usePuzzleStore((s) => s.moves);
  const maxMoves = usePuzzleStore((s) => s.maxMoves);
  const targetScore = usePuzzleStore((s) => s.targetScore);
  const combo = usePuzzleStore((s) => s.combo);
  const gameStarted = usePuzzleStore((s) => s.gameStarted);
  const gameOver = usePuzzleStore((s) => s.gameOver);
  const showLevelComplete = usePuzzleStore((s) => s.showLevelComplete);
  const totalFoodMatched = usePuzzleStore((s) => s.totalFoodMatched);
  const bestScore = usePuzzleStore((s) => s.bestScore);
  const startGame = usePuzzleStore((s) => s.startGame);
  const nextLevel = usePuzzleStore((s) => s.nextLevel);
  const restartGame = usePuzzleStore((s) => s.restartGame);

  const progressPercent = Math.min(100, (score / targetScore) * 100);
  const movesLeft = maxMoves - moves;

  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20">
        {/* Indian-themed background */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, rgba(15,23,42,0.98) 70%)',
        }} />
        
        {/* Floating food emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🥟', '🔺', '🌀', '💧', '🍔', '🍛', '🧅', '🌶️', '🍵', '🫓', '🥘', '🍨'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl md:text-5xl opacity-15"
              style={{
                left: `${5 + (i * 8.5) % 90}%`,
                top: `${10 + ((i * 17) % 80)}%`,
                animation: `float ${3 + (i % 4) * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        
        <div className="relative text-center px-4 max-w-md">
          {/* Main title with Indian flair */}
          <div className="mb-4">
            <div className="text-5xl mb-3">🇮🇳</div>
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-7xl font-black leading-none">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-orange-300 via-orange-400 to-orange-600" 
                  style={{ textShadow: '0 0 40px rgba(245,158,11,0.3)' }}>
                  DESI
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-red-300 via-red-400 to-red-600"
                  style={{ textShadow: '0 0 40px rgba(239,68,68,0.3)' }}>
                  STREET
                </span>
                <span className="block text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500">
                  CRUSH 🎯
                </span>
              </h1>
            </div>
          </div>
          
          <p className="text-base text-orange-200/50 mb-8 font-medium">
            India ka sab tasty puzzle game! 🌶️
          </p>
          
          {/* Food showcase */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {(['golgappe', 'momos', 'samosa', 'jalebi', 'panipuri', 'vadapav'] as const).map((type) => {
              const data = FOOD_DATA[type];
              return (
                <div key={type} className="bg-amber-950/40 rounded-xl px-3 py-2 border border-amber-800/30">
                  <div className="text-xl mb-0.5">
                    {type === 'golgappe' ? '🟠' : type === 'momos' ? '🥟' : type === 'samosa' ? '🔺' : type === 'jalebi' ? '🌀' : type === 'panipuri' ? '💧' : '🍔'}
                  </div>
                  <div className="text-[10px] text-amber-300/60 font-semibold">{data.name}</div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={startGame}
            className="group relative px-10 py-4 rounded-2xl font-bold text-xl text-white transition-all hover:scale-105 active:scale-95 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #dc2626, #b91c1c)',
              boxShadow: '0 0 30px rgba(234,88,12,0.4), 0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              🏃 CHALO KHELO! (Start Game)
            </span>
          </button>
          
          {bestScore > 0 && (
            <div className="mt-6 text-amber-400/40 text-sm">
              🏆 Best Score: {bestScore.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none select-none w-full max-w-lg mx-auto">
      {/* Top bar - styled like a shop signboard */}
      <div className="rounded-2xl overflow-hidden mb-3"
        style={{
          background: 'linear-gradient(135deg, rgba(120,53,15,0.9), rgba(146,64,14,0.85))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div className="p-3 md:p-4">
          {/* Top row */}
          <div className="flex justify-between items-center mb-3">
            {/* Level */}
            <div className="text-center">
              <div className="text-[10px] text-amber-300/50 uppercase tracking-widest mb-0.5">Level</div>
              <div className="text-2xl font-black text-yellow-300">{level}</div>
            </div>
            
            {/* Score */}
            <div className="text-center flex-1 mx-4">
              <div className="text-[10px] text-amber-300/50 uppercase tracking-widest mb-0.5">Score</div>
              <div className="text-3xl font-black text-white tabular-nums">
                {score.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-400/40 mt-0.5">Target: {targetScore.toLocaleString()}</div>
            </div>
            
            {/* Moves */}
            <div className="text-center">
              <div className="text-[10px] text-amber-300/50 uppercase tracking-widest mb-0.5">Moves</div>
              <div className={`text-2xl font-black ${movesLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {movesLeft}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progressPercent}%`,
                background: progressPercent >= 100 
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                  : 'linear-gradient(90deg, #f59e0b, #ea580c, #dc2626)',
                boxShadow: '0 0 10px rgba(245,158,11,0.5)',
              }}
            />
          </div>
          
          {/* Moves dots */}
          <div className="flex gap-0.5 mt-2 justify-center">
            {Array.from({ length: maxMoves }).map((_, i) => (
              <div 
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${100 / maxMoves}%`,
                  maxWidth: '8px',
                  background: i < moves 
                    ? 'rgba(239,68,68,0.6)' 
                    : i < maxMoves - 5 
                      ? 'rgba(245,158,11,0.3)' 
                      : 'rgba(245,158,11,0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Combo popup */}
      {combo > 0 && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div style={{ animation: 'comboAppear 0.5s ease-out' }} className="text-center">
            <div className="text-5xl md:text-6xl font-black"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))',
              }}
            >
              {combo}x COMBO!
            </div>
            <div className="text-lg text-orange-300/70 font-bold mt-1">
              {combo >= 5 ? '🔥 Kya Baat Hai! 🔥' : combo >= 3 ? '⚡ Zabardast! ⚡' : '✨ Shaabash! ✨'}
            </div>
          </div>
        </div>
      )}
      
      {/* Level Complete */}
      {showLevelComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-3xl p-8 border text-center max-w-sm mx-4 shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #2d1a0e, #1c1008)',
              borderColor: 'rgba(245,158,11,0.3)',
              boxShadow: '0 0 60px rgba(245,158,11,0.2), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-xl text-orange-300/60 mb-2">Bahut Badhiya!</div>
            <h2 className="text-4xl font-black mb-1"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Level {level} Complete!
            </h2>
            <div className="space-y-1 text-orange-200/50 text-sm mb-6 mt-4">
              <div>🏆 Score: <span className="text-white font-bold">{score.toLocaleString()}</span></div>
              <div>🍱 Food Matched: <span className="text-amber-300 font-bold">{totalFoodMatched}</span></div>
            </div>
            <button
              onClick={nextLevel}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                boxShadow: '0 0 20px rgba(22,163,74,0.3)',
              }}
            >
              Aage Badho! → (Next Level)
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over */}
      {gameOver && !showLevelComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-3xl p-8 border text-center max-w-sm mx-4 shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #2d1a0e, #1c1008)',
              borderColor: 'rgba(239,68,68,0.3)',
              boxShadow: '0 0 60px rgba(239,68,68,0.15), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-6xl mb-2">😅</div>
            <h2 className="text-4xl font-black text-red-400 mb-1">Arrey Yaar!</h2>
            <div className="text-orange-300/50 mb-4">Moves khatam ho gaye!</div>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between text-orange-200/60">
                <span>Level:</span>
                <span className="text-white font-bold">{level}</span>
              </div>
              <div className="flex justify-between text-orange-200/60">
                <span>Score:</span>
                <span className="text-white font-bold">{score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-orange-200/60">
                <span>Target tha:</span>
                <span className="text-amber-300 font-bold">{targetScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-orange-200/60">
                <span>🏆 Best:</span>
                <span className="text-yellow-400 font-bold">{bestScore.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={restartGame}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                boxShadow: '0 0 20px rgba(234,88,12,0.3)',
              }}
            >
              🔄 Phir Se Khelo! (Retry)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
