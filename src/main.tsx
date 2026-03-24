import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Nav from "./Nav.tsx";
import FetchGHProfile from "./Fetch-GH-Profile.tsx";
import About from "./About.tsx";
import Home from "./Home.tsx";
//import App from "./App.tsx";

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/github", element: <FetchGHProfile /> },
      { path: "/about", element: <About /> },
      {
        path: "/projects",
        element: <div className="p-4">Projects Content</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <title>Anthony's Portfolio</title>
    <RouterProvider router={router} />
  </StrictMode>,
);
