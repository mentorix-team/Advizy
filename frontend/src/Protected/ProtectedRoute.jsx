import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ requireExpert = false, showAuth }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const expertData = localStorage.getItem("expertData");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the current path as a URL parameter
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?returnUrl=${returnUrl}`, { state: { from: location } });
      showAuth();
    }
  }, [isLoggedIn, showAuth, location, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ requireExpert = false, showAuth }) => {
//   const isLoggedIn = localStorage.getItem("isLoggedIn");
//   const isExpertMode = localStorage.getItem("expertData");
//   const location = useLocation();

//   // Show auth popup if the user is not logged in
//   useEffect(() => {
//     if (!isLoggedIn) {
//       showAuth();
//     }
//   }, [isLoggedIn, showAuth]); // Only depend on isLoggedIn

//   // Redirect to home if not logged in
//   if (!isLoggedIn) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   // Redirect to mode-restriction-error if expert mode is required but not enabled
//   if (requireExpert && !isExpertMode) {
//     return <Navigate to="/mode-restriction-error" state={{ from: location }} replace />;
//   }

//   // Render the child routes if all checks pass
//   return <Outlet />;
// };

// export default ProtectedRoute;
