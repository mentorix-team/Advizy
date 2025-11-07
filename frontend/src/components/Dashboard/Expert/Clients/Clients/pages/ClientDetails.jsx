import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/ClientDetails/Header';
import { ClientInformation } from '../components/ClientDetails/ClientInformation';
import { UpcomingSessions } from '../components/ClientDetails/UpcomingSessions';
import { PastSessions } from '../components/ClientDetails/PastSessions';
import { useDispatch, useSelector } from 'react-redux';
import { getClientDetails, getMeetingByExpertId } from '@/Redux/Slices/meetingSlice';

export default function ClientDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clientDetails, meetings } = useSelector((state) => state.meeting);

  useEffect(() => {
    dispatch(getClientDetails(id));
    dispatch(getMeetingByExpertId());
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

  // Filter meetings for this specific client - more inclusive filtering
  let clientMeetings = meetings?.filter(meeting => {
    const clientFirstName = clientDetails.firstName?.toLowerCase();
    const clientLastName = clientDetails.lastName?.toLowerCase();
    const meetingUserName = meeting.userName?.toLowerCase();
    
    return (
      meeting.userId === id || 
      meeting.userId === clientDetails._id ||
      (clientFirstName && meetingUserName?.includes(clientFirstName)) ||
      (clientLastName && meetingUserName?.includes(clientLastName)) ||
      meetingUserName === `${clientFirstName} ${clientLastName}`.trim()
    );
  }) || [];

  // If no client-specific meetings found, show all meetings for debugging
  if (clientMeetings.length === 0) {
    console.log("No client-specific meetings found, showing all meetings for debugging");
    clientMeetings = meetings || [];
  }

  console.log("Client ID:", id);
  console.log("Client Details:", clientDetails);
  console.log("All meetings:", meetings);
  console.log("Client meetings:", clientMeetings);
  
  // Debug: Show structure of first meeting
  if (clientMeetings.length > 0) {
    console.log("First meeting structure:", JSON.stringify(clientMeetings[0], null, 2));
  }

  // Separate upcoming and past sessions with better date handling
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of today for better comparison
  

  const pastSessions = clientMeetings
    .filter(meeting => {
      // Handle both possible date structures
      const meetingDateStr = meeting.daySpecific?.date || meeting.date;
      if (!meetingDateStr) return false;
      
      const meetingDate = new Date(meetingDateStr);
      meetingDate.setHours(0, 0, 0, 0);
      return meetingDate < now;
    })
    .map(meeting => ({
      id: meeting._id,
      date: meeting.daySpecific?.date || meeting.date,
      time: meeting.daySpecific?.slot ? 
        `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}` :
        meeting.time || 'Time not available',
      title: meeting.serviceName || 'Session',
      service: meeting.serviceName,
      duration: meeting.duration || 'N/A',
      amount: meeting.amount,
      status: meeting.isPayed ? 'Completed' : 'Cancelled'
    }));

  const clientData = {
    name: `${clientDetails.firstName} ${clientDetails.lastName}`.trim(),
    email: clientDetails.email,
    service: clientMeetings[0]?.serviceName || "N/A",
    totalSessions: clientMeetings.length,
    status: "Active",
    notes: "No notes available",
    pastSessions: pastSessions,
    upcomingSessions: upcomingSessions,
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
