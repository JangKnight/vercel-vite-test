function Nav() {
  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <a href="#" className="text-lg font-bold">
            Home
          </a>
          <a href="#" className="text-lg">
            About
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
            Login
          </button>
          <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
            Sign Up
          </button>
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Nav;
