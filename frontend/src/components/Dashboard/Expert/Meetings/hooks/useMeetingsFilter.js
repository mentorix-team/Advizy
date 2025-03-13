import { useMemo } from 'react';
import dayjs from 'dayjs';

export const useMeetingsFilter = (meetings, filter, searchQuery, activeTab) => {
  const today = dayjs().format("YYYY-MM-DD");

  const categorizedMeetings = meetings.map(meeting => ({
    ...meeting,
    sessionStatus: meeting.daySpecific.date < today ? "Completed" : "Not Completed"
  }));

  const filteredMeetings = useMemo(() => {
    let tabFilteredMeetings = categorizedMeetings;

    if (activeTab === "past") {
      tabFilteredMeetings = categorizedMeetings.filter(meeting => meeting.sessionStatus === "Completed");
    } else if (activeTab === "upcoming") {
      tabFilteredMeetings = categorizedMeetings.filter(meeting => meeting.sessionStatus !== "Completed");
    }

    const filtered = filter === "All" ? tabFilteredMeetings : tabFilteredMeetings.filter(meeting => {
      switch (filter.toLowerCase()) {
        case "today":
          return meeting.daySpecific.date === today;
        case "this week": {
          const meetingDate = dayjs(meeting.daySpecific.date);
          const weekStart = dayjs(today).startOf("week");
          const weekEnd = dayjs(today).endOf("week");
          return meetingDate.isBetween(weekStart, weekEnd, null, "[]");
        }
        case "this month":
          return dayjs(meeting.daySpecific.date).month() === dayjs(today).month();
        case "scheduled":
          return meeting.sessionStatus === "Not Completed";
        case "completed":
          return meeting.sessionStatus === "Completed";
        case "cancelled":
          return meeting.sessionStatus.toLowerCase().includes("cancel");
        default:
          return true;
      }
    });

    if (!searchQuery) return filtered;

    return filtered.filter(meeting =>
      meeting.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.service.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [meetings, filter, searchQuery, today, activeTab]);

  const todaysMeetings = useMemo(() => {
    return categorizedMeetings.filter(meeting => meeting.daySpecific.date === today);
  }, [categorizedMeetings, today]);

  return { filteredMeetings, todaysMeetings };
};
