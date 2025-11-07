import { Routes, Route } from "react-router-dom";
import UserDashboardLayout from "@/components/Dashboard/User/UserDashboardLayout";
import Meetings from "@/components/Dashboard/User/pages/Meetings";
import UpcomingMeetingDetails from "@/components/Dashboard/User/pages/UpcomingMeetingDetails";
import PastMeetingDetails from "@/components/Dashboard/User/pages/PastMeetingDetails";
// import MeetingInvoice from "@/components/Dashboard/User/pages/MeetingInvoice";
import Payments from "@/components/Dashboard/User/pages/Payments";
import Profile from "@/components/Dashboard/User/pages/Profile";
import Chats from "@/components/Dashboard/User/pages/Chats";
import Favourites from "@/components/Dashboard/User/Favourites/Favourites";

const UserDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboardLayout />}>
        <Route path="/meetings" element={<Meetings />} />
        <Route
          path="/meetings/upcoming/:id"
          element={<UpcomingMeetingDetails />}
        />
        <Route
          path="/meetings/past/:id"
          element={<PastMeetingDetails />}
        />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/favourites" element={<Favourites />} />
      </Route>
    </Routes>
  );
};
export default UserDashboardRoutes;