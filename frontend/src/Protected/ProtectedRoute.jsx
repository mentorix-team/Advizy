import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requireExpert = false }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const expertData = localStorage.getItem("expertData"); // Check if expertData exists

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requireExpert && !expertData) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
