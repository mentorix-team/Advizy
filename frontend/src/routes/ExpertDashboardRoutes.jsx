import { Routes, Route } from "react-router-dom";
import ExpertDashboardLayout from "@/components/Dashboard/Expert/ExpertDashboardLayout";
import Home from "@/components/Dashboard/Expert/Home/Home";
import Chats from "@/components/Dashboard/Expert/Chats";
import Availability from "@/components/Dashboard/Expert/ExpertAvailability/Availability";
import Meetings from "@/components/Dashboard/Expert/Meetings/Meetings";
import ServicePricing from "@/components/Dashboard/Expert/ServiceAndPricing/ServicePricing";
import Payments from "@/components/Dashboard/Expert/Payments/Payments";
import Testimonials from "@/components/Dashboard/Expert/Testimonial/Testimonial";
import ProfileDetails from "@/components/Dashboard/Expert/ProfileDetails/App";
import Clients from "@/components/Dashboard/Expert/Clients/Clients/Clients";
import ClientDetails from "@/components/Dashboard/Expert/Clients/Clients/pages/ClientDetails";

const ExpertDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpertDashboardLayout />}>
        <Route index element={<Home  />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/service-pricing" element={<ServicePricing />} />
        <Route path="/profile-detail" element={<ProfileDetails />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reviews" element={<Testimonials />} />
        <Route path = '/clients' element ={<Clients/>}/>
        <Route path="/clients/:id" element={<ClientDetails />} />

      </Route>
    </Routes>
  );
};

export default ExpertDashboardRoutes;
