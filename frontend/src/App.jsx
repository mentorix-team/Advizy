import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./Protected/ProtectedRoute";
import Spinner from "./components/LoadingSkeleton/Spinner";
import { getUser, logout, validateToken } from "./Redux/Slices/authSlice";
import { fetchFavourites, clearFavourites } from "./Redux/Slices/favouritesSlice";

// Regular Imports (Frequently Used Components)
import AuthPopup from "./components/Auth/AuthPopup.auth";
import Error404 from "./Protected/Error404";
import HomePage from "./components/Home/pages/HomePage";
import AuthError from "./AuthError";
import ContactUs from "./ContactUs";
import AboutUs from "./components/Home/pages/AboutUs";
import CookiePolicy from "./components/Home/pages/policies/CookiePolicy";
import PrivacyPolicy from "./components/Home/pages/policies/PrivacyPolicy";
import RefundPolicy from "./components/Home/pages/policies/RefundPolicy";
import TermsOfService from "./components/Home/pages/policies/TermsOfService";
import GoogleRedirectHandler from "./components/Auth/GoogleRedirectHandler";
import PayyBookingConfirmation from "./components/Dashboard/Expert/Meetings/PayyBookingConfirmation";
import PayuOrderSummary from "./components/Dashboard/User/PayuOrderSummary";

// Lazy Imports (Less Frequently Used Components)
const ExpertDashboardRoutes = lazy(() =>
  import("./routes/ExpertDashboardRoutes")
);
const UserDashboardRoutes = lazy(() => import("./routes/UserDashboardRoutes"));
const ExpertDetailPage = lazy(() =>
  import("./components/Expert/ExpertDetailProfile/ExpertDetailPage")
);
const Scheduling = lazy(() =>
  import("./components/Dashboard/User/Scheduling/Scheduling")
);
const OrderSummary = lazy(() =>
  import("./components/Dashboard/User/OrderSummary")
);
const BookingConfirmation = lazy(() =>
  import("./components/Dashboard/Expert/Meetings/BookingConfirmation")
);
const Meeting = lazy(() => import("./components/Meeting/Meeting"));
const BecomeExpertPage = lazy(() =>
  import("./components/Home/pages/BecomeExpertPage")
);
const Homees = lazy(() => import("./components/Explore/Homees"));
const ReScheduling = lazy(() =>
  import("./components/Dashboard/User/Scheduling/ReScheduling")
);
const GoogleAuthSuccess = lazy(() =>
  import("./components/Auth/GoogleAuthSuccess")
);
const ProfileDetails = lazy(() =>
  import("@/components/Dashboard/Expert/Profile/App")
);
const ReSchedulingUser = lazy(() =>
  import("./components/Dashboard/User/Scheduling/ReSchedulingUser")
);

const App = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Single selector for login state (removed duplicate to avoid redeclare error)
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  // Add this useEffect to App.js to monitor sessionStorage changes
  useEffect(() => {
    const originalSetItem = sessionStorage.setItem;
    const originalRemoveItem = sessionStorage.removeItem;
    const originalClear = sessionStorage.clear;

    sessionStorage.setItem = function (key, value) {
      console.log(`🟢 SessionStorage SET: ${key} = ${value}`);
      console.trace(); // This will show you exactly where setItem is called from
      return originalSetItem.apply(this, arguments);
    };

    sessionStorage.removeItem = function (key) {
      console.log(`🔴 SessionStorage REMOVE: ${key}`);
      console.trace(); // This will show you exactly where removeItem is called from
      return originalRemoveItem.apply(this, arguments);
    };

    sessionStorage.clear = function () {
      console.log(`💥 SessionStorage CLEARED`);
      console.trace(); // This will show you exactly where clear is called from
      return originalClear.apply(this, arguments);
    };

    // Cleanup
    return () => {
      sessionStorage.setItem = originalSetItem;
      sessionStorage.removeItem = originalRemoveItem;
      sessionStorage.clear = originalClear;
    };
  }, []);


  // // Clean up redirectURL when user logs in successfully
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     // Small delay to ensure login process is complete
  //     setTimeout(() => {
  //       const redirectURL = sessionStorage.getItem("redirectURL");
  //       if (redirectURL) {
  //         console.log("User logged in, cleaning up redirectURL:", redirectURL);
  //         sessionStorage.removeItem("redirectURL");
  //       }
  //     }, 1000);
  //   }
  // }, [isLoggedIn]);

  const handleAuthPopupOpen = () => {
    console.log("handleAuthPopupOpen called");
    try {
      const currentURL = location.pathname + location.search;
      const existing = sessionStorage.getItem("redirectURL");
      // Only set if not already set by ProtectedRoute (avoid overwriting more specific target)
      if (!existing) {
        console.log("🔑 Setting redirectURL (user-initiated login):", currentURL);
        sessionStorage.setItem("redirectURL", currentURL);
      } else {
        console.log("redirectURL already set (keeping existing):", existing);
      }
    } catch (e) {
      console.warn("Failed to set redirectURL:", e);
    }
    setShowAuthPopup(true);
  };

  const handleAuthPopupClose = () => setShowAuthPopup(false);

  useEffect(() => {
    console.log('🔀 Navigation:', {
      pathname: location.pathname,
      search: location.search,
      key: location.key,
      historyLength: window.history.length
    });
  }, [location]);

  useEffect(() => {
    const excludedPathPatterns = [
      /^\/$/,
      /^\/auth-error$/,
      /^\/about-us$/,
      /^\/contact$/,
      /^\/cookie-policy$/,
      /^\/privacy-policy$/,
      /^\/refund-policy$/,
      /^\/terms-of-service$/,
      /^\/explore/,
      /^\/meeting$/,
      /^\/expert\/[^/]+$/, // ← this makes /expert/:redirect_url public
      /^\/expert\/scheduling\/[^/]+$/,
      /^\/become-expert$/,
      // /^\/payu-payment-success$/,
      // /^\/payment-success$/,
    ];

    const isExcluded = excludedPathPatterns.some((pattern) =>
      pattern.test(location.pathname)
    );

    if (!isExcluded) {
      const timeout = setTimeout(() => {
        dispatch(validateToken()).then((response) => {
          if (!response?.payload?.valid) {
            localStorage.clear();
            setShowAuthPopup(true);
          }
        });
      }, 500); // ⏳ give cookies time to arrive

      return () => clearTimeout(timeout); // cleanup
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const expertMode = localStorage.getItem("expertMode") === "true";
    if (
      expertMode &&
      !location.pathname.startsWith("/dashboard/expert") &&
      location.pathname !== "/meeting"
    ) {
      navigate("/dashboard/expert/");
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavourites());
    } else {
      dispatch(clearFavourites());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public Routes - No wrapper needed */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/become-expert" element={<BecomeExpertPage />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/explore" element={<Homees />} />
        <Route path="/expert/:redirect_url" element={<ExpertDetailPage />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route
          path="/google-auth-success"
          element={<GoogleRedirectHandler />}
        />
        {/* Protected Routes */}
        <Route
          path="/expert-onboarding"
          element={<ProtectedRoute showAuth={handleAuthPopupOpen} />}
        >
          <Route path="" element={<ProfileDetails />} />
        </Route>
        <Route path="/explore" element={<Homees />} />
        <Route path="/expert/:redirect_url" element={<ExpertDetailPage />} />
        {/* <Route path="/expert-detail/:redirect_url" element={<ExpertDetailPage />} /> */}
        <Route path="/expert/scheduling/:serviceId" element={<Scheduling />} />
        <Route
          path="/expert/rescheduling/:updatemeetingtoken"
          element={<ReScheduling />}
        />
        <Route
          path="/user/rescheduling/:serviceId"
          element={<ReSchedulingUser />}
        />
        {/* <Route path="/expert/order-summary/" element={<OrderSummary />} /> */}
        <Route
          path="/expert/payu-order-summary/"
          element={<PayuOrderSummary />}
        />

        <Route
          path="/payu-payment-success"
          element={<PayyBookingConfirmation />}
        />
        <Route path="/payment-success" element={<BookingConfirmation />} />

        {/* Protected Routes - All using consistent wrapper pattern */}
        <Route
          path="/expert-onboarding"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <ProfileDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expert/scheduling/:serviceId"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <Scheduling />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expert/rescheduling/:updatemeetingtoken"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <ReScheduling />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/rescheduling/:serviceId"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <ReSchedulingUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expert/order-summary/"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <OrderSummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expert/payu-order-summary/"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <PayuOrderSummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/user/*"
          element={
            <ProtectedRoute showAuth={handleAuthPopupOpen}>
              <UserDashboardRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/expert/*"
          element={
            <ProtectedRoute requireExpert={true} showAuth={handleAuthPopupOpen}>
              <ExpertDashboardRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Error404 />} />
      </Routes>
      <AuthPopup isOpen={showAuthPopup} onClose={handleAuthPopupClose} />
    </Suspense>
  );
};

export default App;
