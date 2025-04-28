import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addvideoparticipant,
  fetchMeeting,
  getnotification,
} from "@/Redux/Slices/meetingSlice";
import { toast } from "react-hot-toast";
import { initiatePayout } from "@/Redux/Slices/paymentSlice";
import { useNavigate } from "react-router-dom";
import ProfileShare from "./ProfileShare";
import { Bell, BellOff, X } from "lucide-react";
import NotificationSkeleton from "@/components/LoadingSkeleton/NotificationSkeleton";

export default function Header({ pendingActions }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading, error, currentMeeting } = useSelector(
    (state) => state.meeting
  );
  const { expertData } = useSelector((state) => state.expert);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [joinedMeetingId, setJoinedMeetingId] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false);

  useEffect(() => {
    if (showNotifications) {
      dispatch(getnotification());
    }
  }, [showNotifications, dispatch]);

  useEffect(() => {
    let interval;

    if (joinedMeetingId && isInMeeting) {
      dispatch(fetchMeeting(joinedMeetingId));

      interval = setInterval(() => {
        dispatch(fetchMeeting(joinedMeetingId)).catch((error) => {
          console.error("Error fetching meeting:", error);
          setIsInMeeting(false);
        });
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [joinedMeetingId, isInMeeting, dispatch]);

  useEffect(() => {
    if (currentMeeting?.status === "ENDED") {
      setIsInMeeting(false);
      setJoinedMeetingId(null);
    }
  }, [currentMeeting?.status]);

  const handleJoinCall = async (notification) => {
    try {
      const meetingId = notification.videoCallId;
      const startTime = notification.daySpecific.slot.startTime;
      const endTime = notification.daySpecific.slot.endTime;
      const id = notification._id;
      const user_id = notification.userId;
      const expert_id = notification.expertId;
      const userName = notification.userName;
      const expertName = notification.expertName;
      const serviceName = notification.serviceName;
      
      const joinCallData = {
        meeting_id: notification.videoCallId,
        custom_participant_id: notification.expertId,
        name: expertData.firstName + ' ' + expertData.lastName,
        preset_name: "group_call_host",
      };

      const response = await dispatch(addvideoparticipant(joinCallData)).unwrap();

      if (response?.data?.data?.token) {
        const authToken = response.data.data.token;
        setJoinedMeetingId(notification.videoCallId);
        setIsInMeeting(true);
        setShowNotifications(false);

        navigate("/meeting", { 
          state: { 
            authToken,
            meetingId,
            startTime,
            endTime,
            id,
            serviceName,
            expertName,
            userName,
            expert_id,
            user_id
          } 
        });
      } else {
        toast.error("Failed to join the meeting", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Error joining the meeting", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleAvailMoney = async (notification) => {
    if (!notification.amount) {
      toast.error("Invalid notification data", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    const paymentDetails = expertData.credentials.PaymentDetails?.[0];
    if (!paymentDetails) {
      toast.error("No payment details found", {
        position: "top-right",
        duration: 3000,
      });
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

    try {
      await dispatch(initiatePayout(data)).unwrap();
      toast.success("Payout initiated successfully!", {
        position: "top-right",
        duration: 3000,
      });
      setShowNotifications(false);
    } catch (error) {
      toast.error(error || "Something went wrong while initiating payout.", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const displayedNotifications = showAllNotifications
    ? notifications || []
    : (notifications || []).slice(0, 5);

  const unreadCount = notifications?.filter((n) => !n.read)?.length || 0;

  return (
    <header className="max-w-[1089px] w-full flex flex-col sm:flex-row border justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="w-full flex justify-between items-start sm:items-center mb-4 sm:mb-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {expertData.firstName}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {pendingActions.length > 0 ? (
              <>
                Let's complete your profile to unlock opportunities!<br />
                You're just a few steps away from getting verified and connecting with clients.
              </>
            ) : (
              "Let's make today productive!"
            )}
          </p>
        </div>
        
        <div className="sm:hidden relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-x-4 top-16 bg-white rounded-lg shadow-lg z-50 border max-h-[80vh] flex flex-col">
              <div className="sticky top-0 p-4 border-b bg-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
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
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp}
                      </p>

                      {notification.message.includes("Payment received") && (
                        <button
                          onClick={() => handleAvailMoney(notification)}
                          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm w-full sm:w-auto"
                        >
                          Avail Money
                        </button>
                      )}

                      {notification.message.includes("Video call scheduled") && (
                        <button
                          onClick={() => handleJoinCall(notification)}
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm w-full sm:w-auto"
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

              <div className="sticky bottom-0 p-3 text-center border-t bg-white rounded-b-lg">
                <button
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  {showAllNotifications ? "Show Less" : "View all notifications"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {pendingActions.length === 0 && <ProfileShare expert={expertData} />}

        <div className="hidden sm:block relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle notifications"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border max-h-[80vh] flex flex-col">
              <div className="sticky top-0 p-4 border-b bg-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
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
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp}
                      </p>

                      {notification.message.includes("Payment received") && (
                        <button
                          onClick={() => handleAvailMoney(notification)}
                          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                        >
                          Avail Money
                        </button>
                      )}

                      {notification.message.includes("Video call scheduled") && (
                        <button
                          onClick={() => handleJoinCall(notification)}
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
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

              <div className="sticky bottom-0 p-3 text-center border-t bg-white rounded-b-lg">
                <button
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  {showAllNotifications ? "Show Less" : "View all notifications"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}