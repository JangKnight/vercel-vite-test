import Game2048 from "./Game-2048.tsx";
import MinesweeperGame from "./Minesweeper-Game.tsx";
import SnakeGame from "./Snake-Game.tsx";

const Games = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="overflow-hidden rounded-[2.5rem] border border-emerald-400/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_32%),linear-gradient(160deg,rgba(2,6,23,0.98),rgba(10,18,28,0.94))] p-8 shadow-[0_30px_120px_rgba(15,23,42,0.55)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                Games
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
                Arcade
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-300">
                Fun games using React and TypeScript.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Live now
              </p>
              <div className="mt-3 space-y-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Snake</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Fast arcade loop with a neon board and keyboard controls.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white">2048</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Merge puzzle with score tracking and a warmer, blocky visual
                    system.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white">Minesweeper</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Classic board-clearing logic with flags, timers, and a cleaner
                    mobile fallback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
                Game 01
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Snake</h2>
            </div>
            <SnakeGame />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                Game 02
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">2048</h2>
            </div>
            <Game2048 />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
                Game 03
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                Minesweeper
              </h2>
            </div>
            <MinesweeperGame />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Games;
