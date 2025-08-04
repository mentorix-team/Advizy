import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ requireExpert = false, showAuth }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const expertData = localStorage.getItem("expertData");
  const location = useLocation();
  const navigate = useNavigate();

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