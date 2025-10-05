import { Routes, Route } from "react-router-dom";
import UserDashboardLayout from "@/components/Dashboard/User/UserDashboardLayout";
import Meetings from "@/components/Dashboard/User/pages/Meetings";
import Payments from "@/components/Dashboard/User/pages/Payments";
import Profile from "@/components/Dashboard/User/pages/Profile";
import Chats from "@/components/Dashboard/User/pages/Chats";
import Favourites from "@/components/Dashboard/User/Favourites/Favourites";

const UserDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboardLayout />}>
        {/* ✅ Relative paths below */}
        <Route path="meetings" element={<Meetings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chats" element={<Chats />} />
        <Route path="favourites" element={<Favourites />} />
      </Route>
    </Routes>
  );
};
export default UserDashboardRoutes;