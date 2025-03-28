// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { getExpertById } from "@/Redux/Slices/expert.Slice";
import { addvideoparticipant, getMeetingByUserId } from "@/Redux/Slices/meetingSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const Bookings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // Store the selected meeting
  const toggleSidebar = (meeting) => {
    setSelectedMeeting(meeting);
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading, error, meetings } = useSelector((state) => state.meeting); 
  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);
  console.log(paidMeetings)
  const {data} = useSelector((state)=>state.auth)
  let userData;
  try {
    userData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing user data:", error);
    userData = null; 
  }

  // console.log("This is my user data:", userData);
  console.log("this is paid one",paidMeetings)
  useEffect(() => {
    const getmeet = async () => {
      const response = await dispatch(getMeetingByUserId());
      console.log(response);
    };
    getmeet();
  }, [dispatch]);

  const handleJoinCall = async (meeting) => {
    try {
      console.log(meeting);
      console.log("This is user videocall id ",meeting.videoCallId);
      const joinCallData = {
        meeting_id: meeting.videoCallId,
        custom_participant_id: meeting.userId,
        name: `${userData.firstName} ${userData.lastName}`,
        preset_name: "group_call_participant",
      };
  
      console.log("Preset Name being sent:", joinCallData.preset_name);
  
      const response = await dispatch(addvideoparticipant(joinCallData));
      console.log("this is response",response.payload)
      if (response?.payload?.data?.data?.token) {
        const authToken = response.payload.data.data.token;
  
        console.log("Auth Token received:", authToken);
  
        // Navigate to meeting page with authToken
        navigate("/meeting", { state: { authToken } });
      } else {
        console.error("Failed to retrieve authToken.");
      }
    } catch (error) {
      console.error("Error joining call:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      {/* Main Meeting Cards */}
      {paidMeetings?.map((meeting) => (
        <div key={meeting._id} className="w-96 border border-gray-800 rounded-md mb-4">
          <div className="flex justify-between font-medium items-center p-4">
            <h1>Date: {new Date(meeting.daySpecific.data).toLocaleDateString()}</h1>
            <h1>Time: {meeting.daySpecific.slot.startTime}</h1>
          </div>
          <div className="border border-gray-500">
            <div className="flex justify-between p-3">
              <div className="flex flex-col">
                <h1 className="font-medium text-xl">{meeting.epertId}</h1>
                <h1 className="mt-4 font-medium text-lg">{meeting.serviceId}</h1>
              </div>
              <h1>({meeting.duration} Mins)</h1>
            </div>
            <div className="flex justify-end gap-2 p-5">
              <button
                className="border-2 border-gray-500 p-2 rounded-md"
                onClick={() => toggleSidebar(meeting)} // Pass meeting data for sidebar
              >
                Show details
              </button>
              <button className="border-2 border-gray-500 p-2 rounded-md" onClick={() => handleJoinCall(meeting)}>
                Join Call
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Sidebar */}
      {isSidebarOpen && selectedMeeting && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Meeting Details</h2>
            <button
              onClick={() => setIsSidebarOpen(false)} // Close sidebar
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">
              Upcoming meeting information with <strong>{selectedMeeting.expertName}</strong>.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-semibold text-gray-800">Expert</p>
                <p className="text-gray-600">{selectedMeeting.expertName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Service</p>
                <p className="text-gray-600">{selectedMeeting.serviceName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Date & Time</p>
                <p className="text-gray-600">
                  {new Date(selectedMeeting.date).toLocaleDateString()} at {selectedMeeting.time}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Status</p>
                <span className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded-md">
                  {selectedMeeting.status} {/* Display status */}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Amount</p>
                <p className="text-gray-600">₹{selectedMeeting.amount}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Payment Status</p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-md">
                  {selectedMeeting.paymentStatus} {/* Display payment status */}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Your Message</p>
                <input
                  type="text"
                  className="border-black border"
                  placeholder="Your message to expert"
                />
              </div>
              <div className="flex gap-4">
                <NavLink
                  to="/dashboard/user/scheduling"
                  className={({ isActive }) =>
                    `border-2 border-gray-500 p-2 rounded-md ${
                      isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                    }`
                  }
                >
                  Reschedule Meet
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
