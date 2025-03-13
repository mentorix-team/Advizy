import { todayMeetings } from './meetings/todayMeetings';
import { upcomingMeetings } from './meetings/upcomingMeetings';
import { pastMeetings } from './meetings/pastMeetings';
import { cancelledMeetings } from './meetings/cancelledMeetings';

// Combine all meetings
export const meetings = [
  ...todayMeetings,
  ...upcomingMeetings,
  ...pastMeetings,
  ...cancelledMeetings
];