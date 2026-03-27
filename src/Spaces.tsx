import { Outlet } from "react-router-dom";
import DemoNav from "./Demo-Nav.tsx";

const Spaces = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <DemoNav />
      <Outlet />
    </div>
  );
};

export default Spaces;
