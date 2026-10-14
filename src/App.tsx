/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Components/Register/Register.tsx";
import Login from "./Components/Login/Login.tsx";
import { Toaster } from "react-hot-toast";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import Setting from "./Components/Setting/Setting";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ProtectRoute from "./Components/ProtectRoute/ProtectRoute";
import PostDetails from "./Components/PostDetails/PostDetails";
import ErrorPage from './Components/ErrorPage/ErrorPage';

const App = () => {
  const router = createBrowserRouter([
    { path: "", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
      path: "",
      element: (
        <ProtectRoute>
          <Layout />
        </ProtectRoute>
      ),
      children: [
        { path: "/home", element: <Home /> },
        { path: "/profile", element: <Profile /> },
        { path: "/post/:id", element: <PostDetails /> },
        { path: "/setting", element: <Setting /> },
      ],
    },{path:"*",element:<ErrorPage />}
  ]);
  const queryClient = new QueryClient();
  return (
    <>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <RouterProvider router={router} />;
        </QueryClientProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
