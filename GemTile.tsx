import { useState, useEffect } from 'react';
import { FoodItem, FOOD_DATA } from '../store';

const FOOD_SHAPES: Record<string, { main: string; inner: string; icon: string }> = {
  golgappe: {
    main: 'bg-gradient-to-br from-amber-400 via-orange-400 to-orange-600',
    inner: 'bg-gradient-to-br from-amber-300 to-orange-500',
    icon: '🥟',
  },
  momos: {
    main: 'bg-gradient-to-br from-slate-100 via-white to-slate-200',
    inner: 'bg-gradient-to-br from-white to-slate-100',
    icon: '🥟',
  },
  samosa: {
    main: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-700',
    inner: 'bg-gradient-to-br from-yellow-300 to-amber-600',
    icon: '🔺',
  },
  jalebi: {
    main: 'bg-gradient-to-br from-orange-400 via-red-400 to-orange-600',
    inner: 'bg-gradient-to-br from-orange-300 to-red-500',
    icon: '🌀',
  },
  panipuri: {
    main: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-600',
    inner: 'bg-gradient-to-br from-cyan-300 to-blue-500',
    icon: '💧',
  },
  vadapav: {
    main: 'bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-700',
    inner: 'bg-gradient-to-br from-yellow-500 to-amber-700',
    icon: '🍔',
  },
  chaat: {
    main: 'bg-gradient-to-br from-red-400 via-rose-400 to-red-600',
    inner: 'bg-gradient-to-br from-red-300 to-rose-500',
    icon: '🍛',
  },
};

interface GemTileProps {
  gem: FoodItem | null;
  isSelected: boolean;
  onClick: () => void;
  row: number;
  col: number;
}

export function GemTile({ gem, isSelected, onClick }: GemTileProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const delay = gem?.isNew ? (gem.row * 30 + gem.col * 20) : 0;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [gem?.isNew, gem?.row, gem?.col]);

  if (!gem) {
    return (
      <div className="w-[52px] h-[52px] md:w-[58px] md:h-[58px] rounded-2xl bg-amber-950/30 border border-amber-800/10" />
    );
  }

  const shape = FOOD_SHAPES[gem.type] || FOOD_SHAPES.golgappe;
  const data = FOOD_DATA[gem.type];

  return (
    <button
      onClick={onClick}
      className={`
        w-[52px] h-[52px] md:w-[58px] md:h-[58px] rounded-2xl relative
        transition-all duration-200 ease-out
        ${shape.main}
        ${isSelected ? 'ring-3 ring-yellow-400 ring-offset-2 ring-offset-amber-950 scale-115 z-10 brightness-125' : ''}
        hover:scale-110 hover:z-5 hover:brightness-110
        active:scale-95
        cursor-pointer
        shadow-lg
        ${gem.isSpecial ? 'ring-2 ring-yellow-300/60 animate-pulse' : ''}
      `}
      style={{
        animation: isVisible ? undefined : 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? undefined : 'translateY(-40px) scale(0.5)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isSelected 
          ? `0 0 20px ${data?.glowColor || 'rgba(245,158,11,0.5)'}, 0 0 40px ${data?.glowColor || 'rgba(245,158,11,0.3)'}` 
          : `0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-2xl" />
      </div>
      
      {/* Inner decorative ring */}
      <div className="absolute inset-1.5 rounded-xl border border-white/15" />
      
      {/* Food emoji/symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-2xl md:text-3xl select-none filter drop-shadow-md"
          style={{ 
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          {shape.icon}
        </span>
      </div>
      
      {/* Small name label */}
      <div className="absolute bottom-0.5 inset-x-0 text-center">
        <span className="text-[7px] md:text-[8px] font-bold text-white/70 drop-shadow-md leading-none">
          {data?.name || ''}
        </span>
      </div>
      
      {/* Selection glow */}
      {isSelected && (
        <>
          <div className="absolute -inset-0.5 rounded-2xl border-2 border-yellow-400/70 animate-pulse" />
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{ boxShadow: `inset 0 0 15px ${data?.glowColor || 'rgba(245,158,11,0.4)'}` }}
          />
        </>
      )}
    </button>
  );
}
