import { useEffect } from 'react';
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import MyMeetingUI from './MyMeetingUI';
import { useLocation } from 'react-router-dom';

export default function App1() {
  const location = useLocation();
  const { authToken } = location.state || {};
  const [meeting, initMeeting] = useDyteClient();

  console.log("this is the auth token for this meeting:", authToken);
  console.log("this is the meeting object:", meeting);

  useEffect(() => {
    initMeeting({
      authToken, 
      defaults: {
        audio: true,
        video: true,
      },
    });
  }, [authToken, initMeeting]);

  return (
    <DyteProvider value={meeting} fallback={<i>Loading...</i>}>
      <MyMeetingUI />
    </DyteProvider>
  );
}
