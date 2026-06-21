import { useEffect, useRef, useCallback } from 'react';
import { usePuzzleStore } from '../store';
import { GemTile } from './GemTile';

export function PuzzleBoard() {
  const board = usePuzzleStore((s) => s.board);
  const selectedGem = usePuzzleStore((s) => s.selectedGem);
  const selectGem = usePuzzleStore((s) => s.selectGem);
  const isAnimating = usePuzzleStore((s) => s.isAnimating);
  const setAnimating = usePuzzleStore((s) => s.setAnimating);
  const removeMatches = usePuzzleStore((s) => s.removeMatches);
  const applyGravity = usePuzzleStore((s) => s.applyGravity);
  const fillBoard = usePuzzleStore((s) => s.fillBoard);
  const gameStarted = usePuzzleStore((s) => s.gameStarted);
  
  const animationRef = useRef(false);

  const processBoard = useCallback(async () => {
    if (animationRef.current) return;
    animationRef.current = true;
    setAnimating(true);
    
    let hasMatches = true;
    while (hasMatches) {
      const matches = removeMatches();
      if (matches.length === 0) {
        hasMatches = false;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 350));
      applyGravity();
      await new Promise(resolve => setTimeout(resolve, 300));
      fillBoard();
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    setAnimating(false);
    animationRef.current = false;
    usePuzzleStore.getState().checkWinCondition();
  }, [removeMatches, applyGravity, fillBoard, setAnimating]);

  useEffect(() => {
    if (isAnimating && gameStarted) {
      processBoard();
    }
  }, [isAnimating, gameStarted, processBoard]);

  const handleGemClick = (row: number, col: number) => {
    if (isAnimating) return;
    selectGem(row, col);
  };

  if (!gameStarted || board.length === 0) return null;

  return (
    <div className="relative">
      {/* Outer glow - warm Indian colors */}
      <div className="absolute -inset-6 rounded-3xl opacity-60" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.15), rgba(234,88,12,0.08), transparent)',
          filter: 'blur(20px)',
        }} 
      />
      
      {/* Board frame - like a thaali */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #78350f, #92400e, #78350f)',
          padding: '3px',
          boxShadow: '0 0 0 2px rgba(245,158,11,0.3), 0 0 30px rgba(245,158,11,0.15), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Inner border - decorative */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
            padding: '2px',
          }}
        >
          {/* Board background */}
          <div className="relative rounded-xl p-2.5 md:p-3"
            style={{
              background: 'linear-gradient(180deg, #1c1008 0%, #2d1a0e 50%, #1c1008 100%)',
            }}
          >
            {/* Rangoli pattern overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-xl overflow-hidden"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, #fbbf24 1px, transparent 1px),
                  radial-gradient(circle at 0% 0%, #fbbf24 0.5px, transparent 0.5px)
                `,
                backgroundSize: '24px 24px, 12px 12px',
              }}
            />
            
            {/* Grid */}
            <div className="grid grid-cols-8 gap-[3px] md:gap-1 relative">
              {board.map((row, r) =>
                row.map((food, c) => (
                  <GemTile
                    key={food?.id || `empty-${r}-${c}`}
                    gem={food}
                    isSelected={selectedGem?.row === r && selectedGem?.col === c}
                    onClick={() => handleGemClick(r, c)}
                    row={r}
                    col={c}
                  />
                ))
              )}
            </div>
            
            {/* Corner decorations - like mehendi dots */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-amber-500/30" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500/30" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-amber-500/30" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
