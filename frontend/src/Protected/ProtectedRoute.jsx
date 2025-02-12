import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requireExpert = false, showAuth }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const expertData = localStorage.getItem("expertData");

  useEffect(() => {
    if (!isLoggedIn) {
      showAuth();
    }
  }, [isLoggedIn, showAuth]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requireExpert && !expertData) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;