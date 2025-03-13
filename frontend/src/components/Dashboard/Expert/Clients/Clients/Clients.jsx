import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { StatCard } from "./components/Stats/StatCard";
import { ClientList } from "./components/ClientList";
import ClientDetails from "./pages/ClientDetails";
import { calculateStats } from "./utils/statsCalculator";
import { useDispatch, useSelector } from "react-redux";
import { getMeetingByExpertId } from "@/Redux/Slices/meetingSlice";

export default function Clients() {
  const { expertData } = useSelector((state) => state.expert);
  const { meetings } = useSelector((state) => state.meeting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (expertData?._id) {
      dispatch(getMeetingByExpertId(expertData._id));
    }
  }, [dispatch, expertData?._id]);

  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);

  // Group meetings by userId to count sessions per user
  const clientMap = new Map();

  paidMeetings.forEach((meeting) => {
    if (clientMap.has(meeting.userId)) {
      // Increment session count if user already exists
      const existingClient = clientMap.get(meeting.userId);
      existingClient.sessions += 1;
    } else {
      // Add new client
      clientMap.set(meeting.userId, {
        id: meeting.userId,
        name: meeting.userName,
        service: meeting.serviceName,
        sessions: 1, // First session
        status: "Active", // Modify based on logic (e.g., last session date)
      });
    }
  });

  const clients = Array.from(clientMap.values());

  const stats = calculateStats(clients);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Clients Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard title="Total Clients" value={stats.totalClients.value} subtext={stats.totalClients.subtext} />
          <StatCard title="Active Clients" value={stats.activeClients.value} subtext={stats.activeClients.subtext} />
          <StatCard title="New Clients" value={stats.newClients.value} subtext={stats.newClients.subtext} />
          <StatCard title="Average Revenue" value={stats.averageRevenue.value} subtext={stats.averageRevenue.subtext} />
        </div>

        <ClientList initialClients={clients} onClientsChange={() => {}} />
      </div>
    </div>
  );
}
