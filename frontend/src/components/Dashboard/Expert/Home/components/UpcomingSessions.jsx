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

  // Extract upcoming sessions
  const upcomingSessions = meetings
    ?.map((meeting) => ({
      id: meeting._id,
      client: meeting.userName || "Unknown Client",
      type: "Session", // Adjust if there's a session type field
      date: meeting.daySpecific?.date, // Extract the correct date
      time: meeting.daySpecific?.slot
        ? `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}`
        : "N/A",
      duration: "60 min", // Adjust if duration is available
      initial: meeting.userName ? meeting.userName.charAt(0) : "C", // Extract the first letter of client name
    }))
    .filter((session) => session.date) // Ensure the session has a valid date
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by upcoming date
    .slice(0, 5); // Limit to 5 sessions

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upcoming Sessions</h2>
        <ArrowUpRight onClick={handleUpcomingNavigate} className="cursor-pointer w-4 h-4 text-gray-600"/>
      </div>

      {upcomingSessions.length === 0 ? (
        <p className="text-gray-500">No upcoming sessions.</p>
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
