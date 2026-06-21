import { useState, useEffect, useRef } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  life: number;
  shape: 'circle' | 'square' | 'triangle';
}

const CONFETTI_COLORS = [
  '#f59e0b', '#ea580c', '#dc2626', '#16a34a', 
  '#fbbf24', '#f97316', '#ef4444', '#22c55e',
  '#a855f7', '#ec4899', '#14b8a6',
];

let confettiId = 0;

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const animRef = useRef<number>(0);

  const celebrate = (x: number, y: number, count: number = 30) => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 4 + Math.random() * 8;
      newPieces.push({
        id: confettiId++,
        x,
        y,
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * speed - 5 - Math.random() * 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 6,
        life: 1,
        shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    setPieces(prev => [...prev, ...newPieces]);
  };

  const rain = () => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: confettiId++,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 6,
        life: 1,
        shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    setPieces(prev => [...prev, ...newPieces]);
  };

  useEffect(() => {
    const tick = () => {
      setPieces(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12,
            vx: p.vx * 0.99,
            rotation: p.rotation + p.rotationSpeed,
            life: p.life - 0.008,
          }))
          .filter(p => p.life > 0 && p.y < window.innerHeight + 50)
      );
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return { pieces, celebrate, rain };
}

export function ConfettiLayer({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.shape === 'triangle' ? 0 : p.size,
            backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
            opacity: p.life,
            transform: `rotate(${p.rotation}deg)`,
            boxShadow: p.shape !== 'triangle' ? `0 0 ${p.size}px ${p.color}40` : undefined,
          }}
        />
      ))}
    </div>
  );
}
