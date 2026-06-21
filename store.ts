import { create } from 'zustand';

export type FoodType = 'golgappe' | 'momos' | 'samosa' | 'jalebi' | 'panipuri' | 'vadapav' | 'chaat';

export interface FoodItem {
  id: string;
  type: FoodType;
  row: number;
  col: number;
  isNew?: boolean;
  isMatched?: boolean;
  isSpecial?: boolean;
  specialType?: 'masala_bomb' | 'thunder_chaat' | 'golden_plate';
}

export const FOOD_DATA: Record<FoodType, {
  name: string;
  emoji: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  points: string;
}> = {
  golgappe: {
    name: 'Golgappe',
    emoji: '🥟',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.5)',
    bgGradient: 'from-amber-400 to-orange-500',
    points: 'Pani Puri King!',
  },
  momos: {
    name: 'Momos',
    emoji: '🥟',
    color: '#f8fafc',
    glowColor: 'rgba(248,250,252,0.4)',
    bgGradient: 'from-slate-100 to-slate-300',
    points: 'Steamed Delight!',
  },
  samosa: {
    name: 'Samosa',
    emoji: '🔺',
    color: '#d97706',
    glowColor: 'rgba(217,119,6,0.5)',
    bgGradient: 'from-yellow-500 to-amber-600',
    points: 'Crispy Crunch!',
  },
  jalebi: {
    name: 'Jalebi',
    emoji: '🌀',
    color: '#ea580c',
    glowColor: 'rgba(234,88,12,0.5)',
    bgGradient: 'from-orange-400 to-red-500',
    points: 'Meetha Magic!',
  },
  panipuri: {
    name: 'Pani Puri',
    emoji: '💧',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.5)',
    bgGradient: 'from-cyan-400 to-blue-500',
    points: 'Teekha Blast!',
  },
  vadapav: {
    name: 'Vada Pav',
    emoji: '🍔',
    color: '#a16207',
    glowColor: 'rgba(161,98,7,0.5)',
    bgGradient: 'from-yellow-600 to-orange-700',
    points: 'Mumbai Special!',
  },
  chaat: {
    name: 'Chaat',
    emoji: '🍛',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.5)',
    bgGradient: 'from-red-400 to-rose-600',
    points: 'Chatpata!',
  },
};

interface PuzzleState {
  board: (FoodItem | null)[][];
  score: number;
  level: number;
  moves: number;
  maxMoves: number;
  targetScore: number;
  combo: number;
  maxCombo: number;
  selectedGem: { row: number; col: number } | null;
  isAnimating: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  won: boolean;
  totalMatches: number;
  lastMatchTypes: FoodType[];
  showLevelComplete: boolean;
  bestScore: number;
  totalFoodMatched: number;
  
  initBoard: () => void;
  selectGem: (row: number, col: number) => void;
  swapGems: (r1: number, c1: number, r2: number, c2: number) => void;
  removeMatches: () => { row: number; col: number; type: FoodType }[];
  applyGravity: () => void;
  fillBoard: () => void;
  setAnimating: (val: boolean) => void;
  addScore: (points: number) => void;
  checkWinCondition: () => void;
  nextLevel: () => void;
  restartGame: () => void;
  startGame: () => void;
  setGameOver: (val: boolean) => void;
}

const BOARD_SIZE = 8;
const FOOD_TYPES: FoodType[] = ['golgappe', 'momos', 'samosa', 'jalebi', 'panipuri', 'vadapav'];

function getRandomFood(): FoodType {
  return FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
}

let idCounter = 0;
function generateId(): string {
  return `food-${idCounter++}`;
}

function createFood(row: number, col: number, type?: FoodType): FoodItem {
  return {
    id: generateId(),
    type: type || getRandomFood(),
    row,
    col,
    isNew: true,
  };
}

function createBoard(): (FoodItem | null)[][] {
  const board: (FoodItem | null)[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      let type = getRandomFood();
      while (
        (c >= 2 && board[r][c - 1]?.type === type && board[r][c - 2]?.type === type) ||
        (r >= 2 && board[r - 1]?.[c]?.type === type && board[r - 2]?.[c]?.type === type)
      ) {
        type = getRandomFood();
      }
      board[r][c] = createFood(r, c, type);
    }
  }
  return board;
}

export function findMatches(board: (FoodItem | null)[][]): { row: number; col: number; type: FoodType }[] {
  const matches = new Set<string>();
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const gem = board[r][c];
      if (gem && board[r][c + 1]?.type === gem.type && board[r][c + 2]?.type === gem.type) {
        matches.add(`${r},${c}`);
        matches.add(`${r},${c + 1}`);
        matches.add(`${r},${c + 2}`);
        if (c + 3 < BOARD_SIZE && board[r][c + 3]?.type === gem.type) {
          matches.add(`${r},${c + 3}`);
          if (c + 4 < BOARD_SIZE && board[r][c + 4]?.type === gem.type) {
            matches.add(`${r},${c + 4}`);
          }
        }
      }
    }
  }
  
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const gem = board[r][c];
      if (gem && board[r + 1]?.[c]?.type === gem.type && board[r + 2]?.[c]?.type === gem.type) {
        matches.add(`${r},${c}`);
        matches.add(`${r + 1},${c}`);
        matches.add(`${r + 2},${c}`);
        if (r + 3 < BOARD_SIZE && board[r + 3]?.[c]?.type === gem.type) {
          matches.add(`${r + 3},${c}`);
          if (r + 4 < BOARD_SIZE && board[r + 4]?.[c]?.type === gem.type) {
            matches.add(`${r + 4},${c}`);
          }
        }
      }
    }
  }
  
  return Array.from(matches).map(key => {
    const [r, c] = key.split(',').map(Number);
    return { row: r, col: c, type: board[r][c]!.type };
  });
}

function isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  board: [],
  score: 0,
  level: 1,
  moves: 0,
  maxMoves: 30,
  targetScore: 1000,
  combo: 0,
  maxCombo: 0,
  selectedGem: null,
  isAnimating: false,
  gameStarted: false,
  gameOver: false,
  won: false,
  totalMatches: 0,
  lastMatchTypes: [],
  showLevelComplete: false,
  bestScore: 0,
  totalFoodMatched: 0,

  startGame: () => {
    idCounter = 0;
    set({
      board: createBoard(),
      score: 0,
      level: 1,
      moves: 0,
      maxMoves: 30,
      targetScore: 1000,
      combo: 0,
      maxCombo: 0,
      selectedGem: null,
      isAnimating: false,
      gameStarted: true,
      gameOver: false,
      won: false,
      totalMatches: 0,
      lastMatchTypes: [],
      showLevelComplete: false,
    });
  },

  initBoard: () => {
    set({ board: createBoard() });
  },

  selectGem: (row, col) => {
    const state = get();
    if (state.isAnimating || state.gameOver) return;
    
    const { selectedGem } = state;
    
    if (!selectedGem) {
      set({ selectedGem: { row, col } });
      return;
    }
    
    if (selectedGem.row === row && selectedGem.col === col) {
      set({ selectedGem: null });
      return;
    }
    
    if (isAdjacent(selectedGem.row, selectedGem.col, row, col)) {
      get().swapGems(selectedGem.row, selectedGem.col, row, col);
    } else {
      set({ selectedGem: { row, col } });
    }
  },

  swapGems: (r1, c1, r2, c2) => {
    const state = get();
    const newBoard = state.board.map(row => [...row]);
    
    const temp = newBoard[r1][c1];
    newBoard[r1][c1] = newBoard[r2][c2];
    newBoard[r2][c2] = temp;
    
    if (newBoard[r1][c1]) {
      newBoard[r1][c1] = { ...newBoard[r1][c1]!, row: r1, col: c1 };
    }
    if (newBoard[r2][c2]) {
      newBoard[r2][c2] = { ...newBoard[r2][c2]!, row: r2, col: c2 };
    }
    
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      set({ board: newBoard, selectedGem: null, isAnimating: true, moves: state.moves + 1, combo: 0 });
    } else {
      set({ selectedGem: null });
    }
  },

  removeMatches: () => {
    const state = get();
    const newBoard = state.board.map(row => [...row]);
    const matches = findMatches(newBoard);
    
    if (matches.length === 0) return [];
    
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });
    
    const points = matches.length * 10 * (state.combo + 1);
    const newCombo = state.combo + 1;
    
    set({
      board: newBoard,
      score: state.score + points,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      totalMatches: state.totalMatches + 1,
      totalFoodMatched: state.totalFoodMatched + matches.length,
      lastMatchTypes: matches.map(m => m.type),
    });
    
    return matches;
  },

  applyGravity: () => {
    const state = get();
    const newBoard = state.board.map(row => [...row]);
    
    for (let c = 0; c < BOARD_SIZE; c++) {
      let writeRow = BOARD_SIZE - 1;
      for (let r = BOARD_SIZE - 1; r >= 0; r--) {
        if (newBoard[r][c]) {
          if (r !== writeRow) {
            newBoard[writeRow][c] = { ...newBoard[r][c]!, row: writeRow, col: c };
            newBoard[r][c] = null;
          }
          writeRow--;
        }
      }
    }
    
    set({ board: newBoard });
  },

  fillBoard: () => {
    const state = get();
    const newBoard = state.board.map(row => [...row]);
    
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (!newBoard[r][c]) {
          newBoard[r][c] = createFood(r, c);
        }
      }
    }
    
    set({ board: newBoard });
  },

  setAnimating: (val) => set({ isAnimating: val }),
  addScore: (points) => set(s => ({ score: s.score + points })),
  
  checkWinCondition: () => {
    const state = get();
    if (state.score >= state.targetScore) {
      const newBest = Math.max(state.bestScore, state.score);
      set({ won: true, showLevelComplete: true, isAnimating: true, bestScore: newBest });
    } else if (state.moves >= state.maxMoves) {
      const newBest = Math.max(state.bestScore, state.score);
      set({ gameOver: true, isAnimating: true, bestScore: newBest });
    }
  },
  
  nextLevel: () => {
    const state = get();
    const newLevel = state.level + 1;
    idCounter = 0;
    set({
      level: newLevel,
      board: createBoard(),
      score: 0,
      moves: 0,
      maxMoves: Math.max(18, 30 - Math.floor(newLevel / 3)),
      targetScore: 1000 + (newLevel - 1) * 600,
      combo: 0,
      maxCombo: 0,
      selectedGem: null,
      isAnimating: false,
      gameOver: false,
      won: false,
      totalMatches: 0,
      lastMatchTypes: [],
      showLevelComplete: false,
    });
  },
  
  restartGame: () => {
    idCounter = 0;
    set({
      board: createBoard(),
      score: 0,
      level: 1,
      moves: 0,
      maxMoves: 30,
      targetScore: 1000,
      combo: 0,
      maxCombo: 0,
      selectedGem: null,
      isAnimating: false,
      gameStarted: true,
      gameOver: false,
      won: false,
      totalMatches: 0,
      lastMatchTypes: [],
      showLevelComplete: false,
    });
  },
  
  setGameOver: (val) => set({ gameOver: val }),
}));
