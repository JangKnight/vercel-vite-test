import { Link } from "react-router-dom";

const DemoHome = () => {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          All yours
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white">
          Build your own.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          This section is the sandbox for authenticated users. They can define
          their own about section, manage notes, and publish posts!
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/demos/about"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            About
          </Link>
          <Link
            to="/demos/notes"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Notes
          </Link>
          <Link
            to="/demos/blog"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Blog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DemoHome;
