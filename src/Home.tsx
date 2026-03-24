import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/me.jpeg";
import Exp from "./Exp.tsx";

function Home() {
  const [_count, _setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center pt-4">
        <h3> Hey 👋🏾, I'm Anthony!</h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 pt-4">
        <a
          href="https://www.linkedin.com/in/ajaykay/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={heroImg}
            alt="Anthony Henry"
            className="w-32 h-32 rounded-full shadow-lg"
          />
        </a>
        <p className="block text-blue-600 text-2xl">Full-Stack Developer</p>
        <p className="text-lg text-center max-w-2xl">
          "I build scalable web applications and love solving complex problems
          with clean, efficient code. Passionate about Python, TypeScript,
          React, and cloud architecture."
        </p>
      </div>
      <div className="mt-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">My Journey</h2>
        <Exp />
      </div>
    </>
  );
}

export default Home;
