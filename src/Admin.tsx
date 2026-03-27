import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./Auth.tsx";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const isAnthony = user?.role === "anthony";

  if (!isAuthenticated) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Admin</h2>
          <p className="mt-4 text-lg text-slate-300">
            You need to sign in with the anthony account to manage users and posts.
          </p>
        </div>
      </section>
    );
  }

  if (!isAnthony) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">Admin</h2>
          <p className="mt-4 text-lg text-rose-300">
            This area is only available to the anthony role.
          </p>
        </div>
      </section>
    );
  }

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-full px-5 py-3 text-sm font-semibold transition",
      isActive
        ? "bg-cyan-500 text-slate-950"
        : "border border-white/15 text-slate-100 hover:border-cyan-400 hover:text-cyan-300",
    ].join(" ");

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Admin
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">
            Portfolio control room
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Review users, remove demo content, and keep the portfolio space clean.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink to="/admin/users" end className={getNavClassName}>
              Users
            </NavLink>
            <NavLink to="/admin/posts" className={getNavClassName}>
              Posts
            </NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </section>
  );
};

export default Admin;
