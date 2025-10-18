import NoUpcoming from "@/NoUpcoming";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import { BiVideo } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function UpcomingSessions() {
  const navigate = useNavigate();

  const handleUpcomingNavigate =() =>{
    navigate('/dashboard/expert/meetings')
  }
  const { meetings } = useSelector((state) => state.meeting);
  console.log("This is meetings:", meetings);
  
  // Filter for paid meetings first
  const paidMeetings = meetings?.filter((meeting) => meeting.isPayed) || [];
  
  console.log("Paid meetings:", paidMeetings);

  // Extract upcoming sessions with proper error handling
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of today

  const upcomingSessions = paidMeetings?.map((meeting) => {
      // Handle daySpecific safely - check if it exists and is an object
      let date = null;
      let timeSlot = "N/A";
      
      if (meeting.daySpecific) {
        // Check if daySpecific is an array (warn and convert)
        if (Array.isArray(meeting.daySpecific)) {
          console.warn("⚠️ daySpecific is an array! Using first element:", meeting.daySpecific);
          const firstDay = meeting.daySpecific[0];
          date = firstDay?.date;
          timeSlot = firstDay?.slot
            ? `${firstDay.slot.startTime} - ${firstDay.slot.endTime}`
            : "N/A";
        } else if (typeof meeting.daySpecific === 'object') {
          // Normal object format
          date = meeting.daySpecific.date;
          timeSlot = meeting.daySpecific.slot
            ? `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}`
            : "N/A";
        } else {
          console.warn("⚠️ daySpecific is not an object:", typeof meeting.daySpecific, meeting.daySpecific);
        }
      } else {
        // Fallback to other date fields if daySpecific doesn't exist
        date = meeting.date || meeting.createdAt;
        console.warn("⚠️ No daySpecific found, using fallback date:", date);
      }

      return {
        id: meeting._id,
        client: meeting.userName || "Unknown Client",
        type: meeting.serviceName || "Session",
        date: date,
        time: timeSlot,
        duration: meeting.duration || "60 min",
        initial: meeting.userName ? meeting.userName.charAt(0).toUpperCase() : "C",
      };
    })
    .filter((session) => {
      // Filter for valid dates and future sessions
      if (!session.date) return false;
      
      try {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= now;
      } catch (error) {
        console.warn("Invalid date format:", session.date);
        return false;
      }
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by upcoming date
    .slice(0, 5); // Limit to 5 sessions
    
  console.log("Processed upcoming sessions:", upcomingSessions);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upcoming Sessions</h2>
        <ArrowUpRight onClick={handleUpcomingNavigate} className="cursor-pointer w-4 h-4 text-gray-600"/>
      </div>

      {upcomingSessions.length === 0 ? (
        <NoUpcoming />
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {session.initial}
                </div>
                <div>
                  <h3 className="font-medium">{session.client}</h3>
                  <p className="text-sm text-gray-600">{session.type}</p>
                  <p className="text-xs text-gray-500">
                    <span className="inline-block mr-2">⏰ {session.time}</span>
                    <span>({session.duration})</span>
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-primary hover:text-secondary">
                <BiVideo size={20} />
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      <button
      onClick={handleUpcomingNavigate}
      className="w-full flex items-center justify-center gap-3 mt-4 text-center text-primary hover:text-secondary text-sm font-medium">
        View All Sessions <ArrowUpRight className="w-4 h-4"/>
      </button>
    </div>
  );
}
