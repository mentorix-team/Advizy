import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/ClientDetails/Header';
import { ClientInformation } from '../components/ClientDetails/ClientInformation';
import { UpcomingSessions } from '../components/ClientDetails/UpcomingSessions';
import { PastSessions } from '../components/ClientDetails/PastSessions';
import { useDispatch, useSelector } from 'react-redux';
import { getClientDetails } from '@/Redux/Slices/meetingSlice';

export default function ClientDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clientDetails } = useSelector((state) => state.meeting);

  useEffect(() => {
    dispatch(getClientDetails(id));
  }, [dispatch, id]);

  if (!clientDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Client not found</h1>
        </div>
      </div>
    );
  }

  const clientData = {
    name: `${clientDetails.firstName} ${clientDetails.lastName}`.trim(),
    email: clientDetails.email,
    service: "N/A", // Update when service details are available
    totalSessions: 0, // Update based on meetings count
    status: "Active", // You can derive status from last session date
    notes: "No notes available", // Update if there are client notes
    pastSessions: [], // Fetch and map past sessions
    upcomingSessions: [], // Fetch and map upcoming sessions
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Header name={clientData.name} status={clientData.status} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <ClientInformation
              service={clientData.service}
              totalSessions={clientData.totalSessions}
              notes={clientData.notes}
            />
            <PastSessions sessions={clientData.pastSessions} />
          </div>
          
          <div>
            <UpcomingSessions sessions={clientData.upcomingSessions} />
          </div>
        </div>
      </div>
    </div>
  );
}
