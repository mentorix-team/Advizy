import { FILTER_OPTIONS } from './constants';
import { isSameDay } from './dateUtils';

export const filterMeetings = (meetings, filter, searchQuery) => {
  const today = new Date();
  
  const filtered = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    
    switch (filter.toLowerCase()) {
      case FILTER_OPTIONS.TODAY.toLowerCase():
        return isSameDay(meetingDate, today);
      case FILTER_OPTIONS.THIS_WEEK.toLowerCase():
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return meetingDate >= weekStart && meetingDate <= weekEnd;
      case FILTER_OPTIONS.THIS_MONTH.toLowerCase():
        return meetingDate.getMonth() === today.getMonth();
      case FILTER_OPTIONS.SCHEDULED.toLowerCase():
        return meeting.sessionStatus.toLowerCase() === 'confirmed';
      case FILTER_OPTIONS.COMPLETED.toLowerCase():
        return meeting.sessionStatus.toLowerCase() === 'completed';
      case FILTER_OPTIONS.CANCELLED.toLowerCase():
        return meeting.sessionStatus.toLowerCase().includes('cancel');
      default:
        return true;
    }
  });

  if (!searchQuery) return filtered;

  const query = searchQuery.toLowerCase();
  return filtered.filter(meeting =>
    meeting.client.toLowerCase().includes(query) ||
    meeting.service.toLowerCase().includes(query)
  );
};