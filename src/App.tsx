import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

function App() {
  const [_count, _setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center">
        <h3> Hello, Anthony!</h3>
      </div>
      <div className="flex justify-center">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full max-w-2xl rounded-lg shadow-lg"
        />
      </div>
    </>
  );
}

export default App;
