import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiBell } from "react-icons/bi";
import {
  addvideoparticipant,
  fetchMeeting,
  getnotification,
} from "@/Redux/Slices/meetingSlice";
import toast from "react-hot-toast";
import { initiatePayout } from "@/Redux/Slices/paymentSlice";
import { useNavigate } from "react-router-dom";
import ProfileShare from "./ProfileShare";
import { Bell, BellOff } from "lucide-react";
import NotificationSkeleton from "@/components/LoadingSkeleton/NotificationSkeleton";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading, error, currentMeeting } = useSelector(
    (state) => state.meeting
  );
  const { expertData } = useSelector((state) => state.expert);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [joinedMeetingId, setJoinedMeetingId] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false); // New state to track meeting status

  console.log("this is expert data", expertData);

  useEffect(() => {
    if (showNotifications) {
      dispatch(getnotification());
    }
  }, [showNotifications, dispatch]);

  // Modified useEffect for meeting polling
  useEffect(() => {
    let interval;

    if (joinedMeetingId && isInMeeting) {
      // Check both conditions
      console.log("Starting meeting polling for ID:", joinedMeetingId);

      // Initial fetch
      dispatch(fetchMeeting(joinedMeetingId));

      interval = setInterval(() => {
        dispatch(fetchMeeting(joinedMeetingId)).catch((error) => {
          console.error("Error fetching meeting:", error);
          // Optional: Stop polling on error
          setIsInMeeting(false);
        });
      }, 5000);
    }

    return () => {
      if (interval) {
        console.log("Cleaning up meeting polling");
        clearInterval(interval);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentMeeting?.status === "ENDED") {
      console.log("Meeting has ended!");
      setIsInMeeting(false); // Stop polling when meeting ends
      setJoinedMeetingId(null);
    }
  }, [currentMeeting?.status]);

  const handleJoinCall = async (notification) => {
    try {
      console.log("This is expert video call id", notification.videoCallId);
      const meetingId = notification.videoCallId;
      const startTime = notification.daySpecific.slot.startTime;
      const endTime = notification.daySpecific.slot.endTime;
      const joinCallData = {
        meeting_id: notification.videoCallId,
        custom_participant_id: notification.expertId,
        name: expertData.firstName + " " + expertData.lastName,
        preset_name: "group_call_host",
      };

      console.log("Preset Name being sent:", joinCallData.preset_name);

      const response = await dispatch(
        addvideoparticipant(joinCallData)
      ).unwrap();
      console.log("This is response", response);

      if (response?.data?.data?.token) {
        const authToken = response.data.data.token;
        console.log("Auth Token received:", authToken);
        console.log("meetinng id received:", meetingId);

        // Set both states to enable polling
        setJoinedMeetingId(notification.videoCallId);
        setIsInMeeting(true);

        // Navigate to meeting page with authToken
        navigate("/meeting", {
          state: { authToken, meetingId, startTime, endTime },
        });
      } else {
        console.error("Failed to retrieve authToken.");
        toast.error("Failed to join the meeting");
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Error joining the meeting");
    }
  };

  const handleAvailMoney = async (notification) => {
    if (!notification.amount) {
      toast.error("Invalid notification data");
      return;
    }

    const paymentDetails = expertData.credentials.PaymentDetails?.[0];
    if (!paymentDetails) {
      toast.error("No payment details found");
      return;
    }

    const data = {
      email: expertData.email,
      contactNumber: expertData.mobileNumber,
      amount: notification.amount,
      accountNumber: paymentDetails.accountNumber,
      beneficiaryName: paymentDetails.accountHolderName,
      ifsc: paymentDetails.ifscCode,
      currency: "INR",
      mode: "IMPS",
    };

    console.log("Data sent to initiatePayout:", data);

    try {
      const response = await dispatch(initiatePayout(data)).unwrap();
      console.log("Payout initiated successfully:", response);
      toast.success("Payout initiated successfully!");
    } catch (error) {
      console.error("Failed to initiate payout:", error);
      toast.error(error || "Something went wrong while initiating payout.");
    }
  };

  const displayedNotifications = showAllNotifications
    ? notifications || []
    : (notifications || []).slice(0, 5);

  // count of unread notifications
  const unreadCount = notifications?.filter((n) => !n.read)?.length || 0;

  return (
    <header className="max-w-[1089px] flex border justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {expertData.firstName}
        </h1>
        <p className="text-gray-600">Let's make today productive!</p>
      </div>

      <div className="flex gap-2">
        <ProfileShare expert={expertData} />
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell className="w-6 h-6" />
          {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications?.filter((n) => !n.read)?.length || 0}
          </span> */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <NotificationSkeleton />
              ) : error ? (
                <p className="p-4 text-center text-red-500">{error}</p>
              ) : displayedNotifications?.length ? (
                displayedNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-4 hover:bg-gray-50 border-b"
                  >
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>

                    {notification.message.includes("Payment received") && (
                      <button
                        onClick={() => handleAvailMoney(notification)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Avail Money
                      </button>
                    )}

                    {notification.message.includes("Video call scheduled") && (
                      <button
                        onClick={() => handleJoinCall(notification)}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Join Call
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-700 mb-2" />
                  <p className="text-gray-700">No new notifications</p>
                </div>
              )}
            </div>
            <div className="p-4 text-center border-t">
              <button
                onClick={() => setShowAllNotifications(!showAllNotifications)}
                className="text-primary text-sm font-medium hover:text-secondary"
              >
                {showAllNotifications ? "Show Less" : "View all notifications"}
              </button>
            </div>
          </div>
        )} */}
        {showNotifications && (
          <div className="absolute right-4 mt-4 w-80 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <NotificationSkeleton />
              ) : error ? (
                <p className="p-4 text-center text-red-500">{error}</p>
              ) : displayedNotifications?.length ? (
                displayedNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-4 hover:bg-gray-50 border-b"
                  >
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>

                    {notification.message.includes("Payment received") && (
                      <button
                        onClick={() => handleAvailMoney(notification)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Avail Money
                      </button>
                    )}

                    {notification.message.includes("Video call scheduled") && (
                      <button
                        onClick={() => handleJoinCall(notification)}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Join Call
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-700 mb-2" />
                  <p className="text-gray-700">No new notifications</p>
                </div>
              )}
            </div>
            <div className="p-4 text-center border-t">
              <button
                onClick={() => setShowAllNotifications(!showAllNotifications)}
                className="text-primary text-sm font-medium hover:text-secondary"
              >
                {showAllNotifications ? "Show Less" : "View all notifications"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
