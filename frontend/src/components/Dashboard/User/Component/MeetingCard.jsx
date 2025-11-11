import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineStar,
  AiFillStar,
  AiOutlineClose,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addvideoparticipant } from "@/Redux/Slices/meetingSlice";
import {
  getMeetingStatusLabel,
  getMeetingStatusPillTone,
} from "@/utils/meetingStatus";

export default function MeetingCard({ meeting, isPast, onRate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(null);
  const [submittedFeedback, setSubmittedFeedback] = useState("");
  const { data } = useSelector((state) => state.auth)

  // Debug: Log meeting data to see if rating is included
  // console.log("Meeting data in MeetingCard:", meeting);
  // console.log("Meeting rating field:", meeting?.rating);
  // console.log("Meeting feedback field:", meeting?.feedback);
  // console.log("All meeting keys:", Object.keys(meeting || {}));

  let userData;
  try {
    userData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing user data:", error);
    userData = null;
  }

  // console.log("This is my user data:", userData);
  const handleSubmitRating = () => {
    if (onRate) {
      onRate(meeting._id, { rating, feedback });
    }
    setSubmittedRating(rating);
    setSubmittedFeedback(feedback);
    setIsRatingSubmitted(true);
    setIsRatingModalOpen(false);
  };

  const handleJoinCall = async (meeting) => {
    try {
      // console.log(meeting);
      // console.log("This is user videocall id ", meeting.videoCallId);
      const meetingId = meeting.videoCallId;
      const startTime = meeting.daySpecific.slot.startTime
      const endTime = meeting.daySpecific.slot.endTime
      const user_id = meeting.userId
      const expert_id = meeting.expertId
      const userName = meeting.userName
      const expertName = meeting.expertName
      const serviceName = meeting.serviceName
      const id = meeting._id

      const joinCallData = {
        meeting_id: meeting.videoCallId,
        custom_participant_id: meeting.userId,
        name: `${userData.firstName} ${userData.lastName}`,
        preset_name: "group_call_participant",
      };

      // console.log("Preset Name being sent:", joinCallData.preset_name);

      const response = await dispatch(addvideoparticipant(joinCallData));
      // console.log("this is response", response.payload)
      if (response?.payload?.data?.data?.token) {
        const authToken = response.payload.data.data.token;

        // console.log("Auth Token received:", authToken);

        // Navigate to meeting page with authToken
        navigate("/meeting", { state: { authToken, meetingId, startTime, endTime, id, serviceName, expertName, userName, expert_id, user_id } });
      } else {
        console.error("Failed to retrieve authToken.");
      }
    } catch (error) {
      console.error("Error joining call:", error);
    }
  };

  const handleViewDetails = () => {
    const path = isPast ? `/dashboard/user/meetings/past/${meeting._id}` : `/dashboard/user/meetings/upcoming/${meeting._id}`
    navigate(path)
  }
  const statusLabel = getMeetingStatusLabel(meeting);
  const statusToneClass = getMeetingStatusPillTone(meeting);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{meeting.serviceName}</h3>
          <p className="text-gray-600">{`With: ${meeting.expertName}`}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusToneClass}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="space-y-2 text-gray-600">
        <div className="flex items-center">
          <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
          {new Date(meeting.daySpecific.date).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
          {`${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}`}
        </div>
        <div className="flex items-center">
          <AiOutlineUser className="w-5 h-5 mr-2 text-green-600" />
          {`User: ${meeting.userName}`}
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        {isPast ? (
          <>
            {isPast && onRate && !isRatingSubmitted && !meeting.feedback?.rating ? (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="flex items-center border bgcolor-grey-400 space-x-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AiOutlineStar className="w-5 h-5" />
                <span>Add Rating</span>
              </button>
            ) : isPast && (isRatingSubmitted || meeting.feedback?.rating) ? (
              <button
                disabled
                className="flex items-center space-x-2 text-green-600 px-4 py-2 rounded-lg bg-green-50 cursor-default"
              >
                <AiFillStar className="w-5 h-5" />
                <span>{meeting.feedback?.rating || submittedRating}/5</span>
              </button>
            ) : null}
            <button
              onClick={handleViewDetails}
              className="text-gray-600 px-4 py-2 rounded-lg border bgcolor-grey-400 hover:bg-gray-50 transition-colors"
            >
              View Details
            </button>
          </>
        ) : (
          <>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={() => handleJoinCall(meeting)}>
              Join Meeting
            </button>
            <button
              onClick={handleViewDetails}
              className="text-gray-600 px-4 py-2 rounded-lg border bgcolor-grey-400 hover:bg-gray-50 transition-colors"
            >
              View Details
            </button>
          </>
        )}
      </div>

      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Meeting</h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl"
                >
                  {star <= rating ? (
                    <AiFillStar className="text-yellow-400" />
                  ) : (
                    <AiOutlineStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full p-2 border border-gray-200 rounded-lg mb-4 h-32 resize-none"
            />

            <button
              onClick={handleSubmitRating}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
