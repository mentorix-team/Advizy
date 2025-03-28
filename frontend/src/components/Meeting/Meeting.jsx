import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import { useDispatch, useSelector } from "react-redux";
import MyMeetingUI from "./MyMeetingUI";
import dayjs from "dayjs";  // Import dayjs for time handling
import customParseFormat from "dayjs/plugin/customParseFormat"; 
import { getthemeet, givefeedback, kickAllparticipant } from "@/Redux/Slices/meetingSlice";
import { IoClose } from "react-icons/io5";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
// import Spinner from "../LoadingSkeleton/Spinner";
import Spinner from "../LoadingSkeleton/Spinner";

dayjs.extend(customParseFormat);

export default function Meeting() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { authToken,meetingId ,startTime,endTime,id,serviceName,expertName,userName,expert_id,user_id} = location.state || {};
  const {currentMeeting} = useSelector((state)=>state.meeting)
  console.log('This is meeting',currentMeeting);
  const [meeting, initMeeting] = useDyteClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  // const [meeting, setMeeting] = useState(null);

  console.log("Auth Token:", authToken);
  console.log("Meeting ID:", meetingId);
  console.log("End Time (raw):", endTime);
  console.log("id:", id);

  useEffect(()=>{
    const response = dispatch(getthemeet({id}))
  },[dispatch])

  const handleSubmitRating = async () => {
    if (!rating) {
      alert("Please provide a rating before submitting.");
      return;
    }
  
    try {
      const response = await dispatch(
        givefeedback({
          feedback,
          rating,
          user_id,
          expert_id,
          meeting_id: id,
          userName,
          expertName,
          serviceName,
        })
      );
  
      console.log("Feedback Response:", response);
  
      if (response?.payload?.success) {
        alert("Feedback submitted successfully!");
        setIsRatingModalOpen(false);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  

  useEffect(() => {
    if (!authToken) {
      setError("Auth Token is missing.");
      console.error("Auth Token is missing.");
      return;
    }

    console.log("Initializing meeting with token:", authToken);

    initMeeting({
      authToken,
      defaults: {
        audio: true,
        video: true,
      },
    })
      .then(() => {
        console.log("Meeting initialized successfully.");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error initializing meeting:", err);
        setError("Failed to initialize the meeting. Please try again.");
        setLoading(false);
      });

    if (endTime) {
      const now = dayjs();
      const todayDate = now.format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format

      // Convert "08:30 AM" to a full DateTime object for today
      const meetingEndTime = dayjs(`${todayDate} ${endTime}`, "YYYY-MM-DD hh:mm A");
      const fiveMinutesBeforeEnd = meetingEndTime.subtract(5, "minutes");

      const timeUntilFiveMinBefore = fiveMinutesBeforeEnd.diff(now, "milliseconds");
      const timeUntilEnd = meetingEndTime.diff(now, "milliseconds");

      console.log("Meeting End Time:", meetingEndTime.format());
      console.log("5 Min Warning Time:", fiveMinutesBeforeEnd.format());
      console.log("Time until 5-minute warning (ms):", timeUntilFiveMinBefore);
      console.log("Time until meeting ends (ms):", timeUntilEnd);

      // Notify 5 minutes before meeting ends
      if (timeUntilFiveMinBefore > 0) {
        setTimeout(() => {
          alert("⚠️ The meeting will end in 5 minutes.");
        }, timeUntilFiveMinBefore);
      }

      // Get user data from localStorage
      const storedData = localStorage.getItem("data");
      const parsedData = storedData ? JSON.parse(storedData) : null;

      const loggedInUserId = parsedData?._id; // Extract _id
      const role = parsedData?.role; // Extract role

      // Check if the logged-in user is the expert for this meeting
      const isMeetingExpert = loggedInUserId === expert_id;
      const isMeetingUser = loggedInUserId === user_id;

      if (timeUntilEnd > 0) {
        setTimeout(() => {
          console.log("Meeting ended. Handling post-meeting actions...");

          if (isMeetingUser) {
            console.log("User or expert as participant detected. Kicking all participants and opening feedback modal.");

            dispatch(kickAllparticipant({ id: meetingId }))
              .then((response) => {
                if (response?.payload?.success) {
                  console.log("Participants kicked successfully");
                  setIsRatingModalOpen(true); // Open feedback modal
                }
              })
              .catch((error) => {
                console.error("Error in kickAllparticipant:", error);
              });

          } else if (isMeetingExpert) {
            console.log("Expert (who is the host) detected. Redirecting to expert dashboard.");
            window.location.href = "/dashboard/expert/";
          }
        }, timeUntilEnd);
      }

    }
  }, [authToken, endTime, dispatch, meetingId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <DyteProvider value={meeting}>
        <MyMeetingUI />
      </DyteProvider>
      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Meeting</h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-5 h-5" />
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
