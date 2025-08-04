import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ showAuth }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const expertData = localStorage.getItem("expertData");
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.setItem(
        "redirectURL",
        location.pathname + location.search
      );
      showAuth();
    }
  }, [isLoggedIn, showAuth, location]);

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;