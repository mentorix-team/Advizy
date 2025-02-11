import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";

export default function MyMeetingUI() {
  const { meeting } = useDyteMeeting();

  return (
    <DyteMeeting mode="fill" meeting={meeting} style={{ height: "100vh" }} />
  );
}
