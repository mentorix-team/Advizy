import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../Redux/Slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../LoadingSkeleton/Spinner";

const GoogleRedirectHandler = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const expertParam = searchParams.get("expert");
        // Capture any existing redirectURL (set earlier by ProtectedRoute / manual login trigger)
        let redirectURL = sessionStorage.getItem("redirectURL");
        console.log("🔍 GoogleRedirectHandler: Found redirectURL in sessionStorage:", redirectURL);

        // If none was set (user started OAuth directly from some page), store the current location hash/search
        if (!redirectURL) {
          const current = window.location.pathname; // At callback page, not ideal original; consider passing state in future
          console.log("⚠️ No redirectURL found, current path:", current);
          // We will fallback to '/' if this is the callback route itself
          redirectURL = sessionStorage.getItem("postOAuthOrigin") || sessionStorage.getItem("preOAuthPath");
          console.log("🔄 Trying fallback redirectURL:", redirectURL);
        }

        if (!token || !userParam) {
          throw new Error("Missing authentication data");
        }

        let user, expert;
        try {
          user = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Failed to parse user param', e);
          throw new Error('Invalid user payload');
        }
        if (expertParam) {
          try {
            expert = JSON.parse(decodeURIComponent(expertParam));
          } catch (e) {
            console.warn('Failed to parse expert param, continuing without expert', e);
            expert = null;
          }
        } else {
          expert = null;
        }

        await dispatch(googleLogin({ user, expert, token }));
        console.log("✅ Google login dispatched successfully");
        console.log("🎯 Final redirectURL to navigate to:", redirectURL);
        
        // Always redirect to stored URL, never to home page
        if (redirectURL && 
            redirectURL.trim() !== "" && 
            redirectURL !== '/google-auth-success') {
          console.log("➡️ Navigating to redirectURL:", redirectURL);
          navigate(redirectURL);
        } else {
          // Fallback: go to user dashboard instead of home
          console.log("📊 No valid redirectURL, navigating to dashboard");
          navigate("/dashboard/user/meetings");
        }
        
        // Clean up all redirect-related items
        console.log("🧹 Cleaning up sessionStorage redirect items");
        sessionStorage.removeItem("redirectURL");
        sessionStorage.removeItem("postOAuthOrigin");
        sessionStorage.removeItem("preOAuthPath");
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/auth-error");
      } finally {
        setIsLoading(false);
      }
    };

    processAuth();
  }, [dispatch, navigate, searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  return null;
};

export default GoogleRedirectHandler;
