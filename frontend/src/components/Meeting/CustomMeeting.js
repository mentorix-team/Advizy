import { DyteGrid, DyteMicToggle, DyteCamToggle } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export default function CustomMeeting() {
  const { meeting } = useDyteMeeting();

  return (
    <div>
      {/* Video Grid */}
      <DyteGrid meeting={meeting} />

      {/* Control Bar */}
      <div className="controlbar">
        <DyteMicToggle meeting={meeting} />
        <DyteCamToggle meeting={meeting} />
      </div>
    </div>
  );
}
