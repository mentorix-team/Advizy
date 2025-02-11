import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboardLayout from "@/components/Dashboard/User/UserDashboardLayout";
import UserHome from "@/components/Dashboard/User/UserHome";
import Bookings from "@/components/Dashboard/User/Bookings/Booking";
import Scheduling from "@/components/Dashboard/User/Scheduling/Scheduling";
import Sidebar from "@/components/Dashboard/User/Component/Sidebar";
import Meetings from "@/components/Dashboard/User/pages/Meetings";
import UpcomingMeetingDetails from "@/components/Dashboard/User/pages/UpcomingMeetingDetails";
import PastMeetingDetails from "@/components/Dashboard/User/pages/PastMeetingDetails";
import Payments from "@/components/Dashboard/User/pages/Payments";
import Profile from "@/components/Dashboard/User/pages/Profile";

const UserDashboardRoutes = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/user/meetings" replace />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/meetings/upcoming/:id" element={<UpcomingMeetingDetails />} />
              <Route path="/meetings/past/:id" element={<PastMeetingDetails />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={<div className="p-8">Chats Page</div>} />
            </Routes>
          </div>
        </div>
      </div>
  );
};

export default UserDashboardRoutes;
