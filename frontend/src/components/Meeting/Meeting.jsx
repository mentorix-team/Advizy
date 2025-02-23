import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import { useDispatch } from "react-redux";
import MyMeetingUI from "./MyMeetingUI";
import dayjs from "dayjs";  // Import dayjs for time handling
import customParseFormat from "dayjs/plugin/customParseFormat"; 
import { kickAllparticipant } from "@/Redux/Slices/meetingSlice";

dayjs.extend(customParseFormat);

export default function Meeting() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { authToken, meetingId, endTime } = location.state || {};
  const [meeting, initMeeting] = useDyteClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Auth Token:", authToken);
  console.log("Meeting ID:", meetingId);
  console.log("End Time (raw):", endTime);

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

      // Kick participants when meeting ends
      if (timeUntilEnd > 0) {
        setTimeout(() => {
          console.log("Meeting ended. Kicking all participants...");
          dispatch(kickAllparticipant({ id: meetingId }));
        }, timeUntilEnd);
      }
    }
  }, [authToken, endTime, dispatch, meetingId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading meeting...</div>;
  }

  return (
    <DyteProvider value={meeting}>
      <MyMeetingUI />
    </DyteProvider>
  );
}
