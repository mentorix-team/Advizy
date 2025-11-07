import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineArrowLeft,
  AiOutlineUp,
  AiOutlineDown,
} from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addvideoparticipant,
  getMeetingbyid,
} from "@/Redux/Slices/meetingSlice";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import toast from "react-hot-toast";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { getMeetingStatusLabel, getMeetingStatusPillTone } from "@/utils/meetingStatus";

const parseUserData = (raw) => {
  if (!raw) {
    return null;
  }

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  }

  return raw;
};

const parseISTDateTime = (dateString, timeString) => {
  if (!dateString || !timeString) {
    return null;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const trimmed = timeString.trim();
  if (!trimmed) {
    return null;
  }

  const matches = trimmed.match(/(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?/i);
  if (!matches) {
    return null;
  }

  let hours = Number(matches[1]);
  const minutes = Number(matches[2] ?? "0");
  const period = matches[3]?.toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const normalizedDate = date.toISOString().split("T")[0];
  const hourStr = hours.toString().padStart(2, "0");
  const minuteStr = minutes.toString().padStart(2, "0");

  return new Date(`${normalizedDate}T${hourStr}:${minuteStr}:00+05:30`);
};

const extractNoticePeriodMs = (noticePeriod) => {
  if (noticePeriod === undefined || noticePeriod === null) {
    return null;
  }

  const numericValue = Number.parseInt(String(noticePeriod), 10);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  return numericValue * 60 * 60 * 1000;
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) {
    return "--";
  }

  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${amount}`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numeric);
};

export default function UpcomingMeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const { selectedExpert, selectedService } = useSelector(
    (state) => state.expert
  );
  const {
    selectedMeeting,
    loading: meetingLoading,
    error: meetingError,
  } = useSelector((state) => state.meeting);
  const {
    selectedAvailability,
    loading: availabilityLoading,
  } = useSelector((state) => state.availability);
  const { loading: expertLoading } = useSelector((state) => state.expert);
  const { data } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchedServiceKey = useRef(null);
  const fetchedAvailabilityFor = useRef(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(getMeetingbyid(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!selectedMeeting) {
      return;
    }

    const { serviceId, expertId } = selectedMeeting;

    if (serviceId && expertId) {
      const compoundKey = `${serviceId}-${expertId}`;
      if (fetchedServiceKey.current !== compoundKey) {
        dispatch(getServicebyid({ serviceId, expertId }));
        fetchedServiceKey.current = compoundKey;
      }
    }

    if (expertId && fetchedAvailabilityFor.current !== expertId) {
      dispatch(getAvailabilitybyid(expertId));
      fetchedAvailabilityFor.current = expertId;
    }
  }, [dispatch, selectedMeeting]);

  const userProfile = parseUserData(data);
  const participantName = [userProfile?.firstName, userProfile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || userProfile?.userName || userProfile?.name || "Guest User";

  const startTimeLabel = selectedMeeting?.daySpecific?.slot?.startTime || "--";
  const endTimeLabel = selectedMeeting?.daySpecific?.slot?.endTime || "--";
  const meetingDateLabel = selectedMeeting?.daySpecific?.date
    ? new Date(selectedMeeting.daySpecific.date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Date not available";

  const serviceDescription = selectedService?.detailedDescription ||
    "Your expert will walk you through the planned session agenda.";
  const serviceFeatures = Array.isArray(selectedService?.features)
    ? selectedService.features
    : [];

  const statusLabel = getMeetingStatusLabel(selectedMeeting || {});
  const statusToneClass = getMeetingStatusPillTone(selectedMeeting || {});

  const isLoading = meetingLoading || expertLoading || availabilityLoading;

  if (isLoading) {
    return <Spinner />;
  }

  if (meetingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6 py-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Unable to load meeting details
          </h2>
          <p className="text-gray-600 mb-4">
            {typeof meetingError === "string"
              ? meetingError
              : "Please try again in a moment."}
          </p>
          <button
            onClick={() => navigate("/dashboard/user/meetings")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!selectedMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6 py-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Meeting not found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn’t locate the meeting you were trying to view.
          </p>
          <button
            onClick={() => navigate("/dashboard/user/meetings")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  const handleRescheduleuser = async () => {
    if (!selectedAvailability) {
      toast.error("Availability details are still loading. Please try again shortly.");
      return;
    }

    const policy = selectedAvailability?.availability?.reschedulePolicy;

    if (!policy?.noticeperiod) {
      toast.error("Reschedule policy information is not available for this expert.");
      return;
    }
    const noticePeriodMs = extractNoticePeriodMs(policy.noticeperiod);
    if (noticePeriodMs === null) {
      toast.error("Invalid reschedule policy configured for this meeting.");
      return;
    }

    const { date, slot } = selectedMeeting?.daySpecific || {};
    if (!date || !slot?.startTime) {
      toast.error("This meeting does not have a valid schedule to reschedule.");
      return;
    }

    const meetingStart = parseISTDateTime(date, slot.startTime);
    if (!meetingStart) {
      toast.error("Unable to determine the meeting start time.");
      return;
    }

    if (meetingStart.getTime() - Date.now() < noticePeriodMs) {
      toast.error("Reschedule not allowed: the notice period has already passed.");
      return;
    }

    navigate(`/user/rescheduling/${selectedMeeting.serviceId}`, {
      state: { meeting_id: selectedMeeting._id },
    });
  };

  const handleJoin = async () => {
    if (!selectedMeeting?.videoCallId) {
      toast.error("Meeting link is not available yet.");
      return;
    }

    const joinCallData = {
      meeting_id: selectedMeeting.videoCallId,
      custom_participant_id: selectedMeeting.userId,
      name: participantName,
      preset_name: "group_call_participant",
    };

    try {
      const response = await dispatch(addvideoparticipant(joinCallData)).unwrap();
      const authToken = response?.data?.data?.token;

      if (!authToken) {
        throw new Error("Missing auth token");
      }

      navigate("/meeting", {
        state: {
          authToken,
          meetingId: selectedMeeting.videoCallId,
          startTime: startTimeLabel,
          endTime: endTimeLabel,
          id: selectedMeeting._id,
          serviceName: selectedMeeting.serviceName,
          expertName: selectedMeeting.expertName,
          userName: selectedMeeting.userName,
          expert_id: selectedMeeting.expertId,
          user_id: selectedMeeting.userId,
        },
      });
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Unable to join the meeting. Please try again.");
    }
  };

  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Action Bar - Fixed at bottom for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 space-y-2">
        <button
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          onClick={handleJoin}
        >
          Join Meeting
        </button>
        <div className="flex space-x-2">
          <button
            className="flex-1 text-gray-700 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-500 transition-colors text-sm"
            onClick={handleRescheduleuser}
          >
            Request Reschedule
          </button>
          <button className="flex-1 text-red-500 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-sm">
            Cancel Meeting
          </button>
        </div>
      </div>

      <div className="p-4 pb-32 lg:p-8 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/dashboard/user/meetings")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Meetings
            </button>
          </div>

          {/* Meeting details */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-6">
              <div>
                <h2 className="text-lg md:text-xl text-green-600">
                  {selectedMeeting?.serviceName || selectedService?.name || "Consultation"}
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  {selectedMeeting?.title || selectedService?.tagline || "Session details"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap font-medium capitalize ${statusToneClass}`}
              >
                {statusLabel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <AiOutlineUser className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">
                    {selectedMeeting?.expertName}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm">
                  {selectedExpert?.credentials?.professionalTitle || "Expert"}
                </p>
                {selectedExpert?.credentials?.reviews?.rating ? (
                  <div className="flex items-center mt-1">
                    <span className="text-gray-600">
                      ⭐ {selectedExpert.credentials.reviews.rating}
                    </span>
                  </div>
                ) : null}
              </div>
              <button
                onClick={handleShowPopup}
                className="flex items-center space-x-2 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <BsChatDots className="w-5 h-5" />
                <span className="text-sm">Chat with Expert</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Date</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {meetingDateLabel}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Time Slot</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {startTimeLabel}
                  {endTimeLabel && endTimeLabel !== "--" ? ` - ${endTimeLabel}` : ""}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span className="text-xl">₹</span>
                    <span className="ml-2 text-sm">Price</span>
                  </div>
                  <p className="text-2xl font-medium">
                    {formatCurrency(selectedMeeting?.amount)}
                  </p>
                </div>

              </div>
            </div>

            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                <h3 className="text-lg font-medium">
                  Service Description & Features
                </h3>
                <button className="text-gray-500 hover:text-gray-700">
                  {showDetails ? (
                    <AiOutlineUp className="w-5 h-5" />
                  ) : (
                    <AiOutlineDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              {showDetails && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    {serviceDescription}
                  </p>
                  {serviceFeatures.length > 0 ? (
                    <>
                      <h4 className="font-medium mb-2 text-sm md:text-base">
                        Features included:
                      </h4>
                      <ul className="text-gray-600 space-y-2">
                        {serviceFeatures.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm md:text-base"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Feature information will be shared by your expert during the session.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-80 lg:ml-8">
          <div className="space-y-6 sticky top-8">
            <div className="bg-white space-y-3 p-6 rounded-lg shadow-sm">
              <button
                className="w-full px-4 font-medium py-2 bg-[#16A348] text-white rounded-md hover:bg-[#388544] text-sm"
                onClick={handleJoin}
              >
                Join Meeting
              </button>
              <button
                className="w-full font-medium px-4 py-2 border border-gray-400 text-[#1D1D1F] rounded-md text-sm hover:border-gray-500"
                onClick={handleRescheduleuser}
              >
                Request Reschedule
              </button>
              <button className="w-full px-4 py-2 border border-red-600 text-red-600 font-medium rounded-md text-sm hover:border-red-700" type="button">
                Cancel Meeting
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions or need assistance, our support team
                is here to help.
              </p>
              <button
                onClick={handleShowPopup}
                className="w-full py-2 px-4 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-full max-w-md transform transition-all animate-fade-in">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsChatDots className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
              <p className="text-gray-600">
                We're working hard to bring you this feature. Stay tuned for
                updates!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
