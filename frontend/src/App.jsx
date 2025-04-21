import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./Protected/ProtectedRoute";
import Spinner from "./components/LoadingSkeleton/Spinner";
import { getUser, logout, validateToken } from "./Redux/Slices/authSlice";

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
import PayuOrderSummary from "./components/Dashboard/User/payuordersummary";
import PayyBookingConfirmation from "./components/Dashboard/Expert/Meetings/PayyBookingConfirmation";

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
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAuthPopupOpen = () => setShowAuthPopup(true);
  const handleAuthPopupClose = () => setShowAuthPopup(false);

  // useEffect(() => {
  //   const excludedPaths = [
  //     "/",
  //     "/auth-error",
  //     "/about-us",
  //     "/contact",
  //     "/cookie-policy",
  //     "/privacy-policy",
  //     "/refund-policy",
  //     "/terms-of-service",
  //     "/explore",
  //     "/meeting",
  //     "/expert/:redirect_url",
  //     "/expert/scheduling/:serviceId",
  //     "/become-expert",
  //   ];

  //   if (!excludedPaths.includes(location.pathname)) {
  //     dispatch(validateToken()).then((response) => {
  //       if (!response?.payload?.valid) {
  //         localStorage.clear();
  //         setShowAuthPopup(true);
  //       }
  //     });
  //   }
  // }, [dispatch, location.pathname]);

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
    ];

    const isExcluded = excludedPathPatterns.some((pattern) =>
      pattern.test(location.pathname)
    );

    if (!isExcluded) {
      dispatch(validateToken()).then((response) => {
        if (!response?.payload?.valid) {
          localStorage.clear();
          setShowAuthPopup(true);
        }
      });
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const expertMode = localStorage.getItem("expertMode") === "true";

    // Allow access to /meeting route
    if (
      expertMode &&
      !location.pathname.startsWith("/dashboard/expert") &&
      location.pathname !== "/meeting"
    ) {
      navigate("/dashboard/expert/");
    }
  }, [location, navigate]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/become-expert" element={<BecomeExpertPage />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

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
        <Route path="/expert/scheduling/:serviceId" element={<Scheduling />} />
        <Route
          path="/expert/rescheduling/:updatemeetingtoken"
          element={<ReScheduling />}
        />
        <Route
          path="/user/rescheduling/:serviceId"
          element={<ReSchedulingUser />}
        />
        <Route path="/expert/order-summary/" element={<OrderSummary />} />
        <Route
          path="/expert/payu-order-summary/"
          element={<PayuOrderSummary />}
        />

        <Route
          path="/payu-payment-success"
          element={<PayyBookingConfirmation />}
        />

        <Route path="/payment-success" element={<BookingConfirmation />} />
        {/* <Route path="/google-auth-success" element={<GoogleAuthSuccess />} /> */}
        <Route path="/meeting" element={<Meeting />} />
        {/* Dashboard Routes */}
        <Route
          path="/dashboard/user/*"
          element={<ProtectedRoute showAuth={handleAuthPopupOpen} />}
        >
          <Route path="*" element={<UserDashboardRoutes />} />
        </Route>
        <Route
          path="/dashboard/expert/*"
          element={
            <ProtectedRoute
              requireExpert={true}
              showAuth={handleAuthPopupOpen}
            />
          }
        >
          <Route path="*" element={<ExpertDashboardRoutes />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>

      <AuthPopup isOpen={showAuthPopup} onClose={handleAuthPopupClose} />
    </Suspense>
  );
};

export default App;
