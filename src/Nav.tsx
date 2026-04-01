import { Link } from "react-router-dom";
import { User } from "lucide-react";

function Nav() {
  const middleLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/github", label: "GitHub" },
    { to: "/chat", label: "Chat" },
    { to: "/spaces", label: "Spaces" },
    { to: "/arcade", label: "Arcade" },
  ];

  return (
    <>
      <nav className="flex items-center justify-between gap-6 p-4 bg-gray-800 text-white">
        <div className="flex items-center gap-1">
          <User className="w-8 h-8 text-purple-600" />
          <span className="text-xl font-semibold">Anthony Henry</span>
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
        <div className="w-40">
          <Link
            to="https://api.anthonysjhenry.dev/docs/"
            className="rounded-2xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 flex justify-center"
          >
            API Docs
          </Link>
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Nav;
