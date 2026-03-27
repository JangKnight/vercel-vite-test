import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import Nav from "./Nav.tsx";
import FetchGHProfile from "./Fetch-GH-Profile.tsx";
import Posts from "./Posts.tsx";
import About from "./About.tsx";
import Home from "./Home.tsx";
import Chat from "./Chat.tsx";
import Notes from "./Notes.tsx";
import Demos from "./Demos.tsx";
import DemoHome from "./Demo-Home.tsx";
import DemoAbout from "./Demo-About.tsx";
import DemoBlog from "./Demo-Blog.tsx";
import DemoUserAbout from "./Demo-User-About.tsx";
import DemoUserPosts from "./Demo-User-Posts.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import Admin from "./Admin.tsx";
import AdminUsers from "./Admin-Users.tsx";
import AdminPosts from "./Admin-Posts.tsx";
import { AuthProvider } from "./Auth.tsx";

//import App from "./App.tsx";

const queryClient = new QueryClient();

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
      { path: "/blog", element: <Posts /> },
      { path: "/about", element: <About /> },
      { path: "/chat", element: <Chat /> },
      { path: "/chat/:room", element: <Chat /> },
      {
        path: "/admin",
        element: <Admin />,
        children: [
          { index: true, element: <AdminUsers /> },
          { path: "users", element: <AdminUsers /> },
          { path: "posts", element: <AdminPosts /> },
        ],
      },
      {
        path: "/demos",
        element: <Demos />,
        children: [
          { index: true, element: <DemoHome /> },
          { path: "about", element: <DemoAbout /> },
          { path: "notes", element: <Notes /> },
          { path: "blog", element: <DemoBlog /> },
          { path: "user/:user_id/about", element: <DemoUserAbout /> },
          { path: "user/:user_id/posts", element: <DemoUserPosts /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <title>Anthony's Portfolio</title>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>,
);
