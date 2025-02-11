import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ExpertDashboardRoutes from "./routes/ExpertDashboardRoutes";
import UserDashboardRoutes from "./routes/UserDashboardRoutes";
import RegistrationRoutes from "./routes/RegistrationRoutes";
import Explore from "./Explore";
import ExpertDetailPage from "./components/Expert/ExpertDetailProfile/ExpertDetailPage";
import Scheduling from "./components/Dashboard/User/Scheduling/Scheduling";
import OrderSummary from "./components/Dashboard/User/OrderSummary";
import ExpertProfile from "./components/Dashboard/User/Scheduling/components/ExpertProfile";
import ServiceForm from "./components/Dashboard/Expert/ServiceAndPricing/ServiceModal/ServiceForm";
import BookingConfirmation from "./components/Dashboard/Expert/Meetings/BookingConfirmation";
import Meeting from "./components/Meeting/Meeting";
import HomePage from "./components/Home/pages/HomePage";
import BecomeExpertPage from "./components/Home/pages/BecomeExpertPage";
import ExpertList from "./components/ExpertList/src/components/ExpertList";
import ExpertEducation from "./components/ExpertForms/ExpertEducation";
import Homees from "./components/Explore/Homees";
import ReScheduling from "./components/Dashboard/User/Scheduling/ReScheduling";
import ProtectedRoute from "./Protected/ProtectedRoute";
import GoogleAuthSuccess from "./components/Auth/GoogleAuthSuccess";
import Error404 from "./Protected/Error404";


// import ServiceModal from "./components/Dashboard/Expert/ServiceAndPricing/components/ServiceModal";

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/become-expert" element={<BecomeExpertPage />} />
        <Route path="/services" element={<ServiceForm />} />
        {/* <Route path="experts" element={<ExpertList/>}/> */}
        <Route path="/explore" element={<Homees />} />
        <Route path="/expert/:id" element={<ExpertDetailPage />} />
        <Route path="/expert/scheduling/:serviceId" element={<Scheduling />} />
        <Route path="/expert/rescheduling/:updatemeetingtoken" element={<ReScheduling />} />
        <Route path="/expert/order-summary/" element={<OrderSummary/>} />
        <Route path="/payment-success" element={<BookingConfirmation />} />
        <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

        {/* Add a route for the Meeting component */}
        <Route path="/meeting" element={<Meeting />} />

        {/* User Dashboard Routes */}
        {/* <Route path="/dashboard/user/*" element={<UserDashboardRoutes />} />
        <Route path="/dashboard/expert/*" element={<ExpertDashboardRoutes />} /> */}
        <Route path="/dashboard/user/*" element={<ProtectedRoute />}>
          <Route path="/dashboard/user/*" element={<UserDashboardRoutes />} />
        </Route>
        <Route path="/dashboard/expert/*" element={<ProtectedRoute requireExpert={true} />}>
          <Route path="/dashboard/expert/*" element={<ExpertDashboardRoutes />} />
        </Route>
        <Route path="*" element={<Error404/> } />
      </Routes>
    </div>
  );
};

export default App;
