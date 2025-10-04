import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "../Redux/Slices/authSlice";
import { Loader } from "lucide-react";
import Spinner from "@/components/LoadingSkeleton/Spinner";

const ProtectedRoute = ({ showAuth, requireExpert = false, children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const expertData = localStorage.getItem("expertData");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriggeredAuth, setHasTriggeredAuth] = useState(false);

  // Defensive storage function
  const setRedirectURL = (url) => {
    try {
      console.log(`🔧 ProtectedRoute: Setting redirectURL to: ${url}`);
      sessionStorage.setItem("redirectURL", url);
      console.log(`✅ SessionStorage SET successful`);

      // Verify it was set
      setTimeout(() => {
        const verification = sessionStorage.getItem("redirectURL");
        console.log(
          `🔍 ProtectedRoute: Verification - redirectURL is: ${verification}`
        );
        if (verification !== url) {
          console.error(
            `❌ ProtectedRoute: redirectURL was not set correctly! Expected: ${url}, Got: ${verification}`
          );
        }
      }, 50);
    } catch (error) {
      console.error("Error setting redirectURL:", error);
    }
  };

  useEffect(() => {
    console.log("ProtectedRoute useEffect triggered");
    console.log("Current path:", location.pathname);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("expertData:", !!expertData);
    console.log("requireExpert:", requireExpert);

    const checkAuth = async () => {
      console.log("ProtectedRoute useEffect triggered");
      console.log("Current path:", location.pathname);
      console.log("isLoggedIn:", isLoggedIn);

      setIsLoading(true);

      if (!isLoggedIn) {
        console.log("User not logged in, showing auth popup");
        setIsAuthenticated(false);
        setIsLoading(false);

        if (!hasTriggeredAuth) {
          setHasTriggeredAuth(true);
          // Set redirectURL with defensive approach
          const redirectURL = location.pathname + location.search;
          setRedirectURL(redirectURL);

          // Small delay to ensure storage is set before showing auth
          setTimeout(() => {
            showAuth();
          }, 100);
        }
        return;
      }

      // Reset when user is logged in
      setHasTriggeredAuth(false);

      // Validate token for logged-in users
      const response = await dispatch(validateToken());
      console.log("🔍 Token validation response:", response?.payload);
      if (!response?.payload?.valid) {
        console.log("Token invalid, clearing localStorage");
        localStorage.clear();
        setIsAuthenticated(false);
        setIsLoading(false);

        if (!hasTriggeredAuth) {
          console.log("🚨 Triggering auth popup - user not authenticated");
          setHasTriggeredAuth(true);

          // Don't set redirectURL here - let handleAuthPopupOpen do it
          // This prevents conflicts between ProtectedRoute and manual login triggers

          setTimeout(() => {
            console.log("📢 Calling showAuth()");
            showAuth();
          }, 100);
        } else {
          console.log("⚠️ Auth already triggered, skipping");
        }
        return;
      }

      console.log("Token validated successfully");
      setIsAuthenticated(true);

      // Check expert requirement
      if (requireExpert) {
        if (expertData) {
          console.log("User is an expert");
          setIsExpert(true);
        } else {
          console.log("Expert access required but user is not an expert");
          setIsExpert(false);
          setIsLoading(false);

          if (!hasTriggeredAuth) {
            setHasTriggeredAuth(true);

            // Don't set redirectURL here - let handleAuthPopupOpen do it
            // This prevents conflicts and ensures simpler flow

            setTimeout(() => {
              showAuth();
            }, 100);
          }
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [
    isLoggedIn,
    expertData,
    showAuth,
    dispatch,
    requireExpert,
    hasTriggeredAuth,
    location.pathname,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-8 mx-4 max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (requireExpert && !isExpert) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-8 mx-4 max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Expert Access Required
          </h3>
          <p className="text-gray-600">
            This page requires expert privileges to access.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
