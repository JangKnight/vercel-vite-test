import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type GameStatus = "ready" | "running" | "paused" | "lost";

const GRID_SIZE = 14;
const TICK_MS = 140;
const BEST_SCORE_STORAGE_KEY = "portfolio-snake-best-score";
const INITIAL_DIRECTION: Point = { x: 1, y: 0 };
const INITIAL_SNAKE: Point[] = [
  { x: 4, y: 7 },
  { x: 3, y: 7 },
  { x: 2, y: 7 },
];

const pointKey = (point: Point) => `${point.x}-${point.y}`;

const directionByKey: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

const areOppositeDirections = (a: Point, b: Point) => {
  return a.x + b.x === 0 && a.y + b.y === 0;
};

const getStoredBestScore = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
};

const createFood = (snake: Point[]): Point => {
  const occupied = new Set(snake.map(pointKey));
  const availableCells: Point[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const candidate = { x, y };
      if (!occupied.has(pointKey(candidate))) {
        availableCells.push(candidate);
      }
    }
  }

  if (availableCells.length === 0) {
    return { x: 0, y: 0 };
  }

  const index = Math.floor(Math.random() * availableCells.length);
  return availableCells[index];
};

const SnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(() => INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(() => createFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => getStoredBestScore());
  const [status, setStatus] = useState<GameStatus>("ready");
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const foodRef = useRef<Point>(createFood(INITIAL_SNAKE));
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    if (score <= bestScore) {
      return;
    }

    setBestScore(score);
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  }, [bestScore, score]);

  const resetGame = () => {
    const nextSnake = INITIAL_SNAKE;
    const nextFood = createFood(nextSnake);

    directionRef.current = INITIAL_DIRECTION;
    snakeRef.current = nextSnake;
    foodRef.current = nextFood;
    setSnake(nextSnake);
    setFood(nextFood);
    setScore(0);
    setStatus("ready");
  };

  const startGame = () => {
    if (status === "lost") {
      const nextSnake = INITIAL_SNAKE;
      const nextFood = createFood(nextSnake);

      directionRef.current = INITIAL_DIRECTION;
      snakeRef.current = nextSnake;
      foodRef.current = nextFood;
      setSnake(nextSnake);
      setFood(nextFood);
      setScore(0);
    }

    setStatus("running");
  };

  const pauseGame = () => {
    setStatus("paused");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();

        setStatus((currentStatus) => {
          if (currentStatus === "running") {
            return "paused";
          }

          if (currentStatus === "paused" || currentStatus === "ready") {
            return "running";
          }

          return currentStatus;
        });
        return;
      }

      const nextDirection = directionByKey[event.key];

      if (!nextDirection) {
        return;
      }

      event.preventDefault();

      if (areOppositeDirections(directionRef.current, nextDirection)) {
        return;
      }

      directionRef.current = nextDirection;

      setStatus((currentStatus) => {
        if (currentStatus === "ready" || currentStatus === "paused") {
          return "running";
        }

        return currentStatus;
      });
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentDirection = directionRef.current;
      const currentFood = foodRef.current;
      const nextHead = {
        x: currentSnake[0].x + currentDirection.x,
        y: currentSnake[0].y + currentDirection.y,
      };

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE;

      const hitSelf = currentSnake.some((segment) => {
        return segment.x === nextHead.x && segment.y === nextHead.y;
      });

      if (hitWall || hitSelf) {
        setStatus("lost");
        return;
      }

      const ateFood =
        nextHead.x === currentFood.x && nextHead.y === currentFood.y;
      const nextSnake = [nextHead, ...currentSnake];

      if (!ateFood) {
        nextSnake.pop();
      }

      snakeRef.current = nextSnake;
      setSnake(nextSnake);

      if (ateFood) {
        const nextFood = createFood(nextSnake);
        foodRef.current = nextFood;
        setFood(nextFood);
        setScore((currentScore) => currentScore + 1);
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  const snakeBody = new Set(snake.slice(1).map(pointKey));
  const headKey = pointKey(snake[0]);
  const foodKey = pointKey(food);
  const statusCopy = {
    ready: "Hit start and use the arrow keys or WASD.",
    running: "Eat the amber pixels. Don’t hit the walls.",
    paused: "Game paused. Press space or resume when ready.",
    lost: "Crash. Reset and run it back.",
  }[status];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[2rem] border border-emerald-400/15 bg-[#06110d] p-4 shadow-[0_20px_80px_rgba(5,150,105,0.18)]">
        <div
          className="grid aspect-square w-full gap-1 rounded-[1.5rem] bg-[#020805] p-3"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const key = `${x}-${y}`;
            const isHead = key === headKey;
            const isBody = snakeBody.has(key);
            const isFood = key === foodKey;

            let cellClassName =
              "rounded-[0.45rem] bg-emerald-950/30 ring-1 ring-white/3";

            if (isBody) {
              cellClassName =
                "rounded-[0.45rem] bg-emerald-500/80 shadow-[0_0_14px_rgba(16,185,129,0.25)]";
            }

            if (isHead) {
              cellClassName =
                "rounded-[0.45rem] bg-emerald-200 shadow-[0_0_20px_rgba(167,243,208,0.65)]";
            }

            if (isFood) {
              cellClassName =
                "rounded-[0.45rem] bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.7)]";
            }

            return <div key={key} className={cellClassName} />;
          })}
        </div>
      </div>

      <div className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Snake
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            Neon Grid
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
          {status === "running" ? (
            <button
              type="button"
              onClick={pauseGame}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:text-white"
            >
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              {status === "lost" ? "Play again" : "Start"}
            </button>
          )}
          <button
            type="button"
            onClick={resetGame}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          <p>Controls: Arrow keys or `WASD` to steer.</p>
          <p className="mt-2">Press `space` to start or pause.</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
