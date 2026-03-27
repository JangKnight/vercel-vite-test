import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "./Auth.tsx";

function Nav() {
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = user?.name ?? user?.username ?? user?.email;

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center gap-1">
          <User className="w-8 h-8 text-purple-600" />
          <span className="text-xl font-semibold">Anthony Henry</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-md font-bold hover:text-purple-400">
            Home
          </Link>
          <span className="text-md">|</span>
          <Link to="/about" className="text-md hover:text-purple-400">
            About
          </Link>
          <span className="text-md">|</span>
          <Link to="/blog" className="text-md hover:text-purple-400">
            Blog
          </Link>
          <span className="text-md">|</span>
          <Link to="/github" className="text-md hover:text-purple-400">
            GitHub
          </Link>
          <span className="text-md">|</span>
          <Link to="/chat" className="text-md hover:text-purple-400">
            Chat
          </Link>
          <span className="text-md">|</span>
          <Link to="/demos" className="text-md hover:text-purple-400">
            Demos
          </Link>
          {/* <span className="text-md">|</span>
          <Link to="#" className="text-md cursor-not-allowed">
            <span className="line-through">Projects</span>(refactoring)
          </Link> */}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300">{displayName}</span>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/demos/login"
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Nav;
