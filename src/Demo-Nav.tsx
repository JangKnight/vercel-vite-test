import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "./Auth.tsx";

function Nav() {
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = user?.name ?? user?.username ?? user?.email ?? "Guest";
  const isAnthony = user?.role === "anthony";
  const middleLinks = [
    { to: "/spaces/about", label: "About" },
    { to: "/spaces/notes", label: "Notes" },
    { to: "/spaces/blog", label: "Blog" },
  ];

  return (
    <>
      <nav className="flex items-center justify-between gap-6 p-4 bg-gray-800 text-white">
        <div className="flex items-center gap-1">
          <User className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-semibold">Your Space</span>
        </div>

        <div className="flex flex-1 items-center justify-center gap-4">
          {middleLinks.map((link, index) => (
            <div key={link.to} className="flex items-center gap-4">
              {index > 0 ? <span className="text-md">|</span> : null}
              <Link to={link.to} className="text-md hover:text-purple-400">
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {isAnthony ? (
              <Link to="/admin/users" className="text-md hover:text-purple-400">
                Admin
              </Link>
            ) : null}
            <span className="text-sm text-gray-300">{displayName}</span>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/spaces/login"
              className="text-md font-bold hover:text-purple-400"
            >
              Login
            </Link>
            <Link to="/spaces/signup" className="text-md hover:text-purple-400">
              Sign up
            </Link>
          </div>
        )}
      </nav>
      <hr />
    </>
  );
}

export default Nav;
