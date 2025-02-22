import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import MyMeetingUI from "./MyMeetingUI";
import MeetingLoading from "../LoadingSkeleton/MeetingLoading";

export default function Meeting() {
  const location = useLocation();
  const { authToken } = location.state || {};
  const [meeting, initMeeting] = useDyteClient();
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  console.log("this is the auth token for this meeting:", authToken);
  console.log("this is the meeting object:", meeting);

  useEffect(() => {
    if (!authToken) {
      setError("Auth Token is missing.");
      console.error("Auth Token is missing.");
      return;
    }

    console.log("Initializing meeting with token:", authToken);

    // Initialize the meeting
    initMeeting({
      authToken,
      defaults: {
        audio: true,
        video: true,
      },
    })
      .then(() => {
        console.log("Meeting initialized successfully.");
        setLoading(false); // Set loading to false once meeting is initialized
      })
      .catch((err) => {
        console.error("Error initializing meeting:", err);
        setError("Failed to initialize the meeting. Please try again.");
        setLoading(false);
      });

  }, [authToken]); 

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <MeetingLoading />;
  }

  return (
    <DyteProvider value={meeting}>
      <MyMeetingUI />
    </DyteProvider>
  );
}
