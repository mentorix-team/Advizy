import {
  BsArrowLeft,
  BsClock,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import {
  ArrowRightIcon,
  CheckIcon,
  ColorCalendarIcon,
  CopyIcon,
  VerifiedTickIcon,
} from "@/icons/Icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import PriceBreakdownModal from "../../modals/PriceBreakdownModal";
import Modal from "../../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addvideoparticipant, fetchMeeting, rescheduleByExpert } from "@/Redux/Slices/meetingSlice";
import toast, { Toaster } from "react-hot-toast";

const UpcomingMeetingDetails = ({ meeting, onBack }) => {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [notes, setNotes] = useState(meeting?.notes || "");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [joinedMeetingId, setJoinedMeetingId] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false); // New state to track meeting status

  const [showMeetingPopup, setShowMeetingPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isReschedulePopupOpen, setIsReschedulePopupOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const {  currentMeeting } = useSelector((state) => state.meeting);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log("This is meeting in upcoming meeting details",meeting);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://meet.example.com/${meeting.userName
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    let interval;

    if (joinedMeetingId && isInMeeting) {  // Check both conditions
      console.log("Starting meeting polling for ID:", joinedMeetingId);
      
      // Initial fetch
      dispatch(fetchMeeting(joinedMeetingId));
      
      interval = setInterval(() => {
        dispatch(fetchMeeting(joinedMeetingId))
          .catch(error => {
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
      setIsInMeeting(false);  // Stop polling when meeting ends
      setJoinedMeetingId(null);
    }
  }, [currentMeeting?.status]);

  const handleJoinCall = async (notification) => {
    try {
      console.log("This is expert video call id", notification.videoCallId);

      const joinCallData = {
        meeting_id: meeting.videoCallId,
        custom_participant_id: meeting.expertId,
        name: meeting.expertName,
        preset_name: "group_call_host",
      };

      console.log("Preset Name being sent:", joinCallData.preset_name);

      const response = await dispatch(addvideoparticipant(joinCallData)).unwrap();
      console.log("This is response", response);

      if (response?.data?.data?.token) {
        const authToken = response.data.data.token;
        console.log("Auth Token received:", authToken);

        setJoinedMeetingId(meeting.videoCallId);
        setIsInMeeting(true);

        // Navigate to meeting page with authToken
        navigate("/meeting", { state: { authToken } });
      } else {
        console.error("Failed to retrieve authToken.");
        toast.error("Failed to join the meeting",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Error joining the meeting",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const handleOpenReschedulePopup = () => {
    setReason("");
    setError("");
    setIsReschedulePopupOpen(true);
  };

  const handleReschedule = () => {
    if (!reason.trim()) {
      setError("Reason for rescheduling is required.");
      return;
    }

    if (!meeting) {
      setError("No meeting selected.");
      return;
    }

    // Prepare payload for API call
    const payload = {
      reason,
      userId: meeting.userId,
      serviceName: meeting.serviceName,
      serviceId: meeting.serviceId,
      meetingId: meeting._id,
      razorpay_payment_id: meeting.razorpay_payment_id,
    };
    console.log('this is pauload',payload)
    // Dispatch the action
    dispatch(rescheduleByExpert(payload));

    // Close the popup after dispatching
    setIsReschedulePopupOpen(false);
  };


  const handleOpenCancelPopup = () => {
    setReason("");
    setError("");
    setIsCancelPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsReschedulePopupOpen(false);
    setIsCancelPopupOpen(false);
  };

  const handleFormSubmit = () => {
    if (!reason.trim()) {
      setError("This field cannot be empty.");
    } else {
      setError("");
      // Add your form submission logic here
      console.log("Submitted Reason:", reason);
      handleClosePopup();
    }
  };

  if (!meeting) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row border rounded-md p-2 sm:p-6 gap-4">
      <Toaster position="top-right" />
      
      {/* Left Section: Meeting Details and Notes */}
      <div className="w-full lg:w-[768px] flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center font-medium text-[#16A348] mb-6 hover:text-[#388544]"
        >
          <BsArrowLeft className="mr-2" />
          Back to Meetings
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-lg">
            {meeting.userName && meeting.userName.length > 0 ? meeting.userName[0] : "No client available"}
          </span>

          </div>
          <h1 className="text-xl font-semibold">{meeting.userName}</h1>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Meeting Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Date</h3>
              <div className="flex items-center gap-2">
                <ColorCalendarIcon className="w-5 h-5" />
                <p className="text-gray-900">
                  {new Date(meeting.daySpecific.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Time</h3>
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                <BsClock className="text-[#16A348]" />
                <p className="text-gray-900">{meeting.daySpecific.slot.startTime}</p>
                <p className="text-gray-900">{" - "}</p>
                <p className="text-gray-900">{meeting.daySpecific.slot.endTime}</p>
                </div>
                <span
                  className={`text-sm font-bold ${
                    meeting.sessionStatus === "Completed"
                      ? "text-green-600 bg-green-200 py-1 px-2 rounded-full"
                      : "text-orange-600 bg-orange-200 py-1 px-2 rounded-full"
                  }`}
                >
                  {meeting.sessionStatus}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Service</h3>
              <p className="text-gray-900">{meeting.serviceName}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Amount</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">₹{meeting.amount}</p>
                <button
                  onClick={() => setShowPriceBreakdown(true)}
                  className="text-sm flex items-center text-gray-500 border py-1 px-3 rounded-2xl border-[#169544]"
                >
                  Price breakdown
                  <ArrowRightIcon className="w-3 h-2" />
                </button>
                <span
                  className={`text-sm ${
                    meeting.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {meeting.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* {meeting.summary && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Meeting Agenda</h3>
              <p className="text-gray-900">{meeting.summary}</p>
            </div>
          )} */}

          {meeting.keyPoints?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Discussion Points</h3>
              <ul className="list-disc list-inside space-y-1">
                {meeting.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-900">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion Section */}
        <div className="bg-white p-4 sm:p-6">
          <button
            className="flex justify-between items-center w-full text-left font-semibold text-gray-700 text-lg focus:outline-none"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <span>Service Description & Features</span>
            {isAccordionOpen ? (
              <BsChevronUp className="text-gray-600 transition-transform duration-300" />
            ) : (
              <BsChevronDown className="text-gray-600 transition-transform duration-300" />
            )}
          </button>
          {isAccordionOpen && (
            <div className="mt-4 transition-opacity duration-300">
              <h3 className="text-base text-gray-600 mb-1">
                In-depth project review and strategic planning session
              </h3>
              <p className="text-gray-900 mb-4"></p>
              <h3 className="font-semibold text-gray-800 mb-1">
                Features included:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-900">
                {/* {meeting.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))} */}
                <li className="flex items-center">
                  {" "}
                  <CheckIcon className="w-4 h-4 text-[#169544] mr-1" />{" "}
                  Personalized consultation
                </li>
                <li className="flex items-center">
                  {" "}
                  <CheckIcon className="w-4 h-4 text-[#169544] mr-1" /> Project
                  analysis and feedback
                </li>
                <li className="flex items-center">
                  {" "}
                  <CheckIcon className="w-4 h-4 text-[#169544] mr-1" />{" "}
                  Strategic planning advice
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Preparation Notes</h2>

          <div className="mb-4">
            <textarea
              className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add preparation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            Save Notes
          </button>
        </div>

        <PriceBreakdownModal
          isOpen={showPriceBreakdown}
          onClose={() => setShowPriceBreakdown(false)}
          amount={meeting.amount}
        />
      </div>

      {/* Right Section: Actions */}
      <div className="w-full lg:w-[300px] flex-shrink-0 self-start">
        <div className="bg-white grid gap-y-2 border rounded-lg shadow-sm p-4 mb-2 sm:p-6">
          <h1 className="text-lg font-semibold mb-4">Actions</h1>
          <button
            onClick={handleJoinCall}
            className="w-full px-4 font-medium py-2 bg-[#16A348] text-white rounded-md hover:bg-[#388544] text-sm"
          >
            Join Meeting
          </button>
          {/* Meeting Popup */}
          {showMeetingPopup && (
            <div className="fixed gap-3 inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between py-2">
                  <h2 className="text-xl font-semibold">Join Meeting</h2>
                  {/* Close Popup */}
                  <button
                    onClick={() => setShowMeetingPopup(false)}
                    className="text-sm font-semibold text-gray-800"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 mb-4">
                  Click the button below to join your meeting with{" "}
                  {meeting.userName}.
                </p>

                {/* Meeting Link */}
                <div className="flex items-center border rounded-md p-2 mb-4">
                  <input
                    type="text"
                    value={`https://meet.example.com/${meeting.userName
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    readOnly
                    className="flex-1 text-gray-900 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="text-[#16A348] hover:text-[#388544] ml-2"
                  >
                    {!copySuccess ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16A348"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-copy"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    ) : (
                      <VerifiedTickIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Open Meeting Room Button */}
                <a
                  href={`https://meet.example.com/${meeting.userName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#16A348] text-white py-2 rounded-md hover:bg-[#388544]"
                >
                  Open Meeting Room ↗
                </a>
              </div>
            </div>
          )}
          <button
            onClick={handleOpenCancelPopup}
            className="w-full px-4 py-2 border border-red-600 text-red-600 font-medium rounded-md text-sm hover:border-red-700"
          >
            Cancel Meeting
          </button>
          {/* Cancel Popup */}
          {isCancelPopupOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-medium mb-4">Cancel Meeting</h2>
                <textarea
                  placeholder="Reason for cancellation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-md p-2 mb-2"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleClosePopup}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleOpenReschedulePopup}
            className="w-full font-medium px-4 py-2 border border-gray-400 text-[#1D1D1F] rounded-md text-sm hover:border-gray-500"
          >
            Reschedule Meeting
          </button>
          {/* Reschedule Popup */}
          {isReschedulePopupOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white flex flex-col gap-2 rounded-md shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-medium mb-2">Reschedule Meeting</h2>
                <p className="font-semibold text-gray-800">Existing Availability</p>
                <textarea
                  placeholder="Reason for rescheduling..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-md p-2 mb-2"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleClosePopup}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReschedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white grid gap-y-4 border rounded-lg shadow-sm p-4 sm:p-6">
          <h1 className="font-bold text-lg">Need Help?</h1>
          <p className="text-sm py-1">
            If you have any questions or need assistance, our support team is
            here to help.
          </p>
          <button className="border py-2 px-6 rounded-md border-gray-300 font-medium hover:border-[#16A348]">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

UpcomingMeetingDetails.propTypes = {
  meeting: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    sessionStatus: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    summary: PropTypes.string,
    keyPoints: PropTypes.arrayOf(PropTypes.string),
    notes: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
};

export default UpcomingMeetingDetails;