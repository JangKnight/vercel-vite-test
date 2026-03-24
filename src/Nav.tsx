import { Link } from "react-router-dom";
import { User, Menu } from "lucide-react";

function Nav() {
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
          <Link to="/github" className="text-md hover:text-purple-400">
            GitHub
          </Link>
          {/* <span className="text-md">|</span>
          <Link to="/chat" className="text-md hover:text-purple-400">
            Chat
          </Link>
          <span className="text-md">|</span>
          <Link to="#" className="text-md cursor-not-allowed">
            <span className="line-through">Projects</span>(under construction)
          </Link> */}
        </div>
        {/*
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
            Login
          </button>
          <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
            Sign Up
          </button>
        </div>
          */}
      </nav>
      <hr />
    </>
  );
}

export default Nav;
