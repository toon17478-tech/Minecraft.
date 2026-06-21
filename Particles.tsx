import { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<number>(0);
  let nextId = useRef(0);

  const emit = useCallback((x: number, y: number, colors: string[], count: number = 12) => {
    const newOnes: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 3 + Math.random() * 5;
      newOnes.push({
        id: nextId.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        life: 1,
      });
    }
    setParticles(prev => [...prev, ...newOnes]);
  }, []);

  useEffect(() => {
    const tick = () => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.15, life: p.life - 0.025 }))
          .filter(p => p.life > 0)
      );
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return { particles, emit };
}

export function ParticleLayer({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size * p.life,
            height: p.size * p.life,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
