import { useEffect, useState } from "react";

type Cell = {
  row: number;
  column: number;
  isMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
};

type Board = Cell[][];
type GameStatus = "ready" | "playing" | "won" | "lost";
type InteractionMode = "reveal" | "flag";

const GRID_SIZE = 9;
const MINE_COUNT = 10;
const BEST_TIME_STORAGE_KEY = "portfolio-minesweeper-best-time";

const adjacentNumberStyles: Record<number, string> = {
  1: "text-sky-300",
  2: "text-emerald-300",
  3: "text-rose-300",
  4: "text-violet-300",
  5: "text-amber-300",
  6: "text-cyan-300",
  7: "text-slate-200",
  8: "text-orange-300",
};

const createEmptyBoard = (): Board => {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, column) => ({
      row,
      column,
      isMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
    })),
  );
};

const cloneBoard = (board: Board): Board => {
  return board.map((row) => row.map((cell) => ({ ...cell })));
};

const getNeighborCoordinates = (row: number, column: number) => {
  const neighbors: Array<{ row: number; column: number }> = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;

      if (
        nextRow < 0 ||
        nextRow >= GRID_SIZE ||
        nextColumn < 0 ||
        nextColumn >= GRID_SIZE
      ) {
        continue;
      }

      neighbors.push({ row: nextRow, column: nextColumn });
    }
  }

  return neighbors;
};

const getStoredBestTime = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(BEST_TIME_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const formatElapsedTime = (seconds: number | null) => {
  if (seconds === null) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const buildBoardFromExisting = (
  existingBoard: Board,
  safeRow: number,
  safeColumn: number,
): Board => {
  const nextBoard = createEmptyBoard();
  const blockedCells = new Set(
    [{ row: safeRow, column: safeColumn }, ...getNeighborCoordinates(safeRow, safeColumn)].map(
      ({ row, column }) => `${row}-${column}`,
    ),
  );
  const availableCells: Array<{ row: number; column: number }> = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      nextBoard[row][column].isFlagged = existingBoard[row][column].isFlagged;

      if (!blockedCells.has(`${row}-${column}`)) {
        availableCells.push({ row, column });
      }
    }
  }

  for (let mineIndex = 0; mineIndex < MINE_COUNT; mineIndex += 1) {
    const selectedIndex = Math.floor(Math.random() * availableCells.length);
    const selectedCell = availableCells.splice(selectedIndex, 1)[0];
    nextBoard[selectedCell.row][selectedCell.column].isMine = true;
  }

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      if (nextBoard[row][column].isMine) {
        continue;
      }

      nextBoard[row][column].adjacentMines = getNeighborCoordinates(row, column).filter(
        ({ row: neighborRow, column: neighborColumn }) =>
          nextBoard[neighborRow][neighborColumn].isMine,
      ).length;
    }
  }

  return nextBoard;
};

const revealConnectedCells = (
  board: Board,
  startRow: number,
  startColumn: number,
) => {
  const nextBoard = cloneBoard(board);
  const queue: Array<{ row: number; column: number }> = [
    { row: startRow, column: startColumn },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    const cell = nextBoard[current.row][current.column];

    if (cell.isRevealed || cell.isFlagged) {
      continue;
    }

    cell.isRevealed = true;

    if (cell.isMine || cell.adjacentMines > 0) {
      continue;
    }

    getNeighborCoordinates(current.row, current.column).forEach((neighbor) => {
      const nextCell = nextBoard[neighbor.row][neighbor.column];

      if (!nextCell.isRevealed && !nextCell.isMine) {
        queue.push(neighbor);
      }
    });
  }

  return nextBoard;
};

const revealEntireBoard = (board: Board) => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isRevealed: true,
    })),
  );
};

const hasPlayerWon = (board: Board) => {
  return board.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed),
  );
};

const MinesweeperGame = () => {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [status, setStatus] = useState<GameStatus>("ready");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => getStoredBestTime());
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("reveal");
  const [hasGeneratedBoard, setHasGeneratedBoard] = useState(false);

  useEffect(() => {
    if (status !== "playing" || !hasGeneratedBoard) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasGeneratedBoard, status]);

  useEffect(() => {
    if (status !== "won") {
      return;
    }

    if (bestTime !== null && elapsedSeconds >= bestTime) {
      return;
    }

    setBestTime(elapsedSeconds);
    window.localStorage.setItem(BEST_TIME_STORAGE_KEY, String(elapsedSeconds));
  }, [bestTime, elapsedSeconds, status]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setStatus("ready");
    setElapsedSeconds(0);
    setHasGeneratedBoard(false);
    setInteractionMode("reveal");
  };

  const toggleFlag = (row: number, column: number) => {
    if (status === "won" || status === "lost") {
      return;
    }

    setBoard((currentBoard) => {
      const cell = currentBoard[row][column];

      if (cell.isRevealed) {
        return currentBoard;
      }

      const nextBoard = cloneBoard(currentBoard);
      nextBoard[row][column].isFlagged = !nextBoard[row][column].isFlagged;
      return nextBoard;
    });
  };

  const revealCell = (row: number, column: number) => {
    if (status === "won" || status === "lost") {
      return;
    }

    const selectedCell = board[row][column];

    if (selectedCell.isFlagged || selectedCell.isRevealed) {
      return;
    }

    const sourceBoard = hasGeneratedBoard
      ? board
      : buildBoardFromExisting(board, row, column);

    if (!hasGeneratedBoard) {
      setHasGeneratedBoard(true);
    }

    const sourceCell = sourceBoard[row][column];

    if (sourceCell.isMine) {
      setBoard(revealEntireBoard(sourceBoard));
      setStatus("lost");
      return;
    }

    const nextBoard = revealConnectedCells(sourceBoard, row, column);
    const nextStatus = hasPlayerWon(nextBoard) ? "won" : "playing";

    setBoard(nextBoard);
    setStatus(nextStatus);
  };

  const handleCellAction = (row: number, column: number) => {
    if (interactionMode === "flag") {
      toggleFlag(row, column);
      return;
    }

    revealCell(row, column);
  };

  const handleCellContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: number,
    column: number,
  ) => {
    event.preventDefault();
    toggleFlag(row, column);
  };

  const flaggedCount = board.flat().filter((cell) => cell.isFlagged).length;
  const minesLeft = MINE_COUNT - flaggedCount;
  const statusCopy = {
    ready: "Reveal a square to seed the board. Right-click or flag mode marks mines.",
    playing: "Clear the board without hitting a mine.",
    won: "Clean sweep. Try to beat your best time.",
    lost: "Boom. Reset and try another layout.",
  }[status];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[2rem] border border-sky-400/15 bg-[#0a1220] p-4 shadow-[0_20px_80px_rgba(14,165,233,0.12)]">
        <div
          className="grid aspect-square w-full gap-2 rounded-[1.5rem] bg-[#050a12] p-3"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {board.flatMap((row) =>
            row.map((cell) => {
              const hiddenClassName = cell.isFlagged
                ? "bg-sky-600/80 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)]"
                : "bg-slate-800 text-slate-100 hover:bg-slate-700";
              const revealedClassName = cell.isMine
                ? "bg-rose-500/90 text-white shadow-[0_0_18px_rgba(244,63,94,0.28)]"
                : "bg-slate-950/80 text-slate-100 ring-1 ring-white/5";
              const numberClassName = adjacentNumberStyles[cell.adjacentMines] ?? "text-slate-100";

              return (
                <button
                  key={`${cell.row}-${cell.column}`}
                  type="button"
                  onClick={() => handleCellAction(cell.row, cell.column)}
                  onContextMenu={(event) =>
                    handleCellContextMenu(event, cell.row, cell.column)
                  }
                  className={`aspect-square rounded-[0.8rem] text-lg font-semibold transition ${
                    cell.isRevealed ? revealedClassName : hiddenClassName
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      "*"
                    ) : cell.adjacentMines > 0 ? (
                      <span className={numberClassName}>{cell.adjacentMines}</span>
                    ) : (
                      ""
                    )
                  ) : cell.isFlagged ? (
                    "!"
                  ) : (
                    ""
                  )}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            Minesweeper
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            Deep Field
          </h3>
          <p className="mt-3 text-sm text-slate-300">{statusCopy}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Mines left
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{minesLeft}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Time
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {formatElapsedTime(elapsedSeconds)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Best clear
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {formatElapsedTime(bestTime)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            New board
          </button>
          <button
            type="button"
            onClick={() =>
              setInteractionMode((currentMode) =>
                currentMode === "reveal" ? "flag" : "reveal",
              )
            }
            className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
              interactionMode === "flag"
                ? "border-sky-300 bg-sky-300/15 text-sky-200"
                : "border-white/15 text-slate-100 hover:border-white/40 hover:text-white"
            }`}
          >
            {interactionMode === "flag" ? "Flag mode" : "Reveal mode"}
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          <p>Desktop: left click reveals, right click flags.</p>
          <p className="mt-2">
            Mobile or trackpad: switch between reveal and flag mode.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinesweeperGame;
