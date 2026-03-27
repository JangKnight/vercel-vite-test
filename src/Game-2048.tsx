import { useEffect, useRef, useState } from "react";

type Board = number[][];
type Direction = "up" | "down" | "left" | "right";
type GameStatus = "playing" | "won" | "lost";

const GRID_SIZE = 4;
const WINNING_VALUE = 2048;
const BEST_SCORE_STORAGE_KEY = "portfolio-2048-best-score";

const keyToDirection: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

const createEmptyBoard = (): Board => {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
};

const cloneBoard = (board: Board): Board => {
  return board.map((row) => [...row]);
};

const transposeBoard = (board: Board): Board => {
  return Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
    Array.from({ length: GRID_SIZE }, (_, columnIndex) => board[columnIndex][rowIndex]),
  );
};

const getStoredBestScore = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
};

const addRandomTile = (board: Board): Board => {
  const nextBoard = cloneBoard(board);
  const emptyCells: Array<{ row: number; column: number }> = [];

  nextBoard.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === 0) {
        emptyCells.push({ row: rowIndex, column: columnIndex });
      }
    });
  });

  if (emptyCells.length === 0) {
    return nextBoard;
  }

  const selectedCell =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];
  nextBoard[selectedCell.row][selectedCell.column] =
    Math.random() < 0.9 ? 2 : 4;

  return nextBoard;
};

const createInitialBoard = (): Board => {
  return addRandomTile(addRandomTile(createEmptyBoard()));
};

const collapseLine = (line: number[]) => {
  const nonZeroValues = line.filter((value) => value !== 0);
  const collapsed: number[] = [];
  let gainedScore = 0;
  let won = false;

  for (let index = 0; index < nonZeroValues.length; index += 1) {
    const currentValue = nonZeroValues[index];
    const nextValue = nonZeroValues[index + 1];

    if (currentValue === nextValue) {
      const mergedValue = currentValue * 2;
      collapsed.push(mergedValue);
      gainedScore += mergedValue;
      won = won || mergedValue === WINNING_VALUE;
      index += 1;
      continue;
    }

    collapsed.push(currentValue);
  }

  while (collapsed.length < GRID_SIZE) {
    collapsed.push(0);
  }

  const moved = collapsed.some((value, index) => value !== line[index]);

  return {
    line: collapsed,
    gainedScore,
    moved,
    won,
  };
};

const moveBoard = (board: Board, direction: Direction) => {
  const isVertical = direction === "up" || direction === "down";
  const shouldReverse = direction === "right" || direction === "down";
  const workingBoard = isVertical ? transposeBoard(board) : cloneBoard(board);
  let moved = false;
  let gainedScore = 0;
  let won = false;

  const nextBoard = workingBoard.map((row) => {
    const sourceRow = shouldReverse ? [...row].reverse() : [...row];
    const result = collapseLine(sourceRow);
    moved = moved || result.moved;
    gainedScore += result.gainedScore;
    won = won || result.won;

    return shouldReverse ? result.line.reverse() : result.line;
  });

  return {
    board: isVertical ? transposeBoard(nextBoard) : nextBoard,
    moved,
    gainedScore,
    won,
  };
};

const canMove = (board: Board) => {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const value = board[row][column];

      if (value === 0) {
        return true;
      }

      if (column < GRID_SIZE - 1 && value === board[row][column + 1]) {
        return true;
      }

      if (row < GRID_SIZE - 1 && value === board[row + 1][column]) {
        return true;
      }
    }
  }

  return false;
};

const tileStyles: Record<number, string> = {
  0: "bg-[#151922] text-transparent border border-white/4",
  2: "bg-[#eee4da] text-[#3f3225]",
  4: "bg-[#ede0c8] text-[#3f3225]",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white",
  256: "bg-[#edcc61] text-white",
  512: "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
};

const directionButtons: Array<{ label: string; direction: Direction }> = [
  { label: "Up", direction: "up" },
  { label: "Left", direction: "left" },
  { label: "Down", direction: "down" },
  { label: "Right", direction: "right" },
];

const Game2048 = () => {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => getStoredBestScore());
  const [status, setStatus] = useState<GameStatus>("playing");
  const boardRef = useRef<Board>(board);
  const scoreRef = useRef(0);
  const statusRef = useRef<GameStatus>(status);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (score <= bestScore) {
      return;
    }

    setBestScore(score);
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  }, [bestScore, score]);

  const resetGame = () => {
    const nextBoard = createInitialBoard();
    boardRef.current = nextBoard;
    scoreRef.current = 0;
    statusRef.current = "playing";
    setBoard(nextBoard);
    setScore(0);
    setStatus("playing");
  };

  const continueAfterWin = () => {
    statusRef.current = "playing";
    setStatus("playing");
  };

  const handleMove = (direction: Direction) => {
    if (statusRef.current === "lost" || statusRef.current === "won") {
      return;
    }

    const result = moveBoard(boardRef.current, direction);

    if (!result.moved) {
      return;
    }

    const nextBoard = addRandomTile(result.board);
    const nextScore = scoreRef.current + result.gainedScore;
    const nextStatus = result.won
      ? "won"
      : canMove(nextBoard)
        ? "playing"
        : "lost";

    boardRef.current = nextBoard;
    scoreRef.current = nextScore;
    statusRef.current = nextStatus;
    setBoard(nextBoard);
    setScore(nextScore);
    setStatus(nextStatus);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const statusCopy = {
    playing: "Stack identical tiles until you build a 2048 block.",
    won: "You hit 2048. Continue if you want to push higher.",
    lost: "No moves left. Reset and try another run.",
  }[status];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[2rem] border border-amber-300/20 bg-[#20160f] p-4 shadow-[0_20px_80px_rgba(251,191,36,0.14)]">
        <div className="grid aspect-square w-full grid-cols-4 gap-3 rounded-[1.5rem] bg-[#32251b] p-4">
          {board.flatMap((row, rowIndex) =>
            row.map((value, columnIndex) => {
              const styleClassName = tileStyles[value] ?? "bg-[#3c3a32] text-white";
              const textSizeClassName =
                value >= 1024 ? "text-xl" : value >= 128 ? "text-2xl" : "text-3xl";

              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`flex items-center justify-center rounded-[1.25rem] font-semibold shadow-inner transition-all duration-150 ${styleClassName} ${textSizeClassName}`}
                >
                  {value === 0 ? "" : value}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            2048
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            Merge Grid
          </h3>
          <p className="mt-3 text-sm text-slate-300">{statusCopy}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{score}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Best
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{bestScore}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            New game
          </button>
          {status === "won" ? (
            <button
              type="button"
              onClick={continueAfterWin}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:text-white"
            >
              Continue
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {directionButtons.map((button) => (
            <button
              key={button.direction}
              type="button"
              onClick={() => handleMove(button.direction)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300 hover:text-amber-200"
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          <p>Controls: Arrow keys or `WASD` to slide the board.</p>
          <p className="mt-2">Merge matching tiles until you reach `2048`.</p>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
