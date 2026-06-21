import { useState } from 'react';

interface Popup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  scale?: number;
}

let popupId = 0;

export function useScorePopups() {
  const [popups, setPopups] = useState<Popup[]>([]);

  const addPopup = (x: number, y: number, text: string, color: string = '#ffffff') => {
    const newPopup: Popup = { id: popupId++, x, y, text, color };
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 1000);
  };

  return { popups, addPopup };
}

export function ScorePopups({ popups }: { popups: Popup[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {popups.map(popup => (
        <div
          key={popup.id}
          className="absolute font-black text-2xl animate-scorePop"
          style={{
            left: popup.x,
            top: popup.y,
            color: popup.color,
            textShadow: `0 0 10px ${popup.color}`,
            animation: 'scoreFly 1s ease-out forwards',
          }}
        >
          {popup.text}
        </div>
      ))}
    </div>
  );
}
