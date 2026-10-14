import React from "react";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  if (localStorage.getItem("token") === null) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectRoute;