import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import MeetingCard from "../Component/MeetingCard";
import { getMeetingByUserId } from "@/Redux/Slices/meetingSlice";
import NoData2 from "@/NoData2";

// Helper function to format dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

// Helper to get today's date string
const getTodayString = () => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
};

// Helper to get tomorrow's date string
const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(tomorrow);
};

export default function Meetings() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "upcoming";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { meetings } = useSelector((state) => state.meeting);
  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);

  console.log("All paid meetings:", paidMeetings);

  useEffect(() => {
    try {
      dispatch(getMeetingByUserId());
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [dispatch]);

  // Group meetings into today, tomorrow, next week, upcoming, and past
  // Group meetings into today, tomorrow, next week, upcoming, and past
  // Group meetings into today, tomorrow, next week, upcoming, and past
const groupedMeetings = paidMeetings.reduce(
  (acc, meeting) => {
    try {
      if (!meeting.daySpecific || !meeting.daySpecific.date || !meeting.daySpecific.slot) {
        console.warn("Invalid meeting format:", meeting);
        return acc;
      }

      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0); // Start of today
      
      const meetingDate = new Date(meeting.daySpecific.date);
      const meetingEnd = new Date(`${meeting.daySpecific.date}T${meeting.daySpecific.slot.endTime}`);
      
      // Reset seconds and milliseconds for accurate comparison
      now.setSeconds(0, 0);
      meetingDate.setHours(0, 0, 0, 0); // Normalize to start of day
      meetingEnd.setSeconds(0, 0);

      // Log current time and meeting details for debugging
      console.log(`\nProcessing meeting: ${meeting._id}`);
      console.log(`Now: ${now.toString()}`);
      console.log(`Today start: ${todayStart.toString()}`);
      console.log(`Meeting date: ${meetingDate.toString()}`);
      console.log(`Meeting end time: ${meetingEnd.toString()}`);

      // Check if meeting is in the past (either date is before today OR end time has passed if today)
      if (meetingDate < todayStart) {
        // Meeting date is before today
        console.log(`--> PAST (date before today)`);
        acc.past.push(meeting);
        return acc;
      } else if (meetingDate.toDateString() === now.toDateString() && meetingEnd < now) {
        // Meeting is today but end time has passed
        console.log(`--> PAST (today's meeting that ended)`);
        acc.past.push(meeting);
        return acc;
      }

      // Rest of your code remains the same...
      // Check if meeting is today (and not in past)
      const isToday = meetingDate.toDateString() === now.toDateString();
      if (isToday) {
        console.log(`--> TODAY (upcoming/ongoing)`);
        acc.today.push(meeting);
        return acc;
      }

      // Check if meeting is tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const isTomorrow = meetingDate.toDateString() === tomorrow.toDateString();
      if (isTomorrow) {
        console.log(`--> TOMORROW`);
        acc.tomorrow.push(meeting);
        return acc;
      }

      // Check if meeting is in the next 7 days (next week)
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      nextWeek.setHours(0, 0, 0, 0);
      if (meetingDate > tomorrow && meetingDate <= nextWeek) {
        console.log(`--> NEXT WEEK`);
        acc.nextWeek.push(meeting);
        return acc;
      }

      // All other future meetings
      if (meetingDate > now) {
        console.log(`--> UPCOMING (beyond next week)`);
        acc.upcoming.push(meeting);
        return acc;
      }

      console.warn(`--> UNCATEGORIZED`);
      return acc;
    } catch (error) {
      console.error("Error processing meeting:", error, meeting);
      return acc;
    }
  },
  { today: [], tomorrow: [], nextWeek: [], upcoming: [], past: [] }
);
  // Detailed logging of grouped meetings
  // console.log("\n=== GROUPED MEETINGS ===");
  // console.log("Today's meetings:", groupedMeetings.today);
  // console.log("Tomorrow's meetings:", groupedMeetings.tomorrow);
  // console.log("Next week's meetings:", groupedMeetings.nextWeek);
  // console.log("Upcoming meetings:", groupedMeetings.upcoming);
  // console.log("Past meetings:", groupedMeetings.past);
  // console.log("=======================\n");
  // console.log("Grouped meetings:", groupedMeetings);

  // Check if there are any upcoming meetings
  const hasUpcomingMeetings =
    groupedMeetings.today.length > 0 ||
    groupedMeetings.tomorrow.length > 0 ||
    groupedMeetings.nextWeek.length > 0 ||
    groupedMeetings.upcoming.length > 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meetings</h1>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <button
            className={clsx(
              "px-4 py-2 border-b-2 font-medium text-sm",
              activeTab === "upcoming"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Meetings
          </button>
          <button
            className={clsx(
              "px-4 py-2 border-b-2 font-medium text-sm ml-8",
              activeTab === "past"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("past")}
          >
            Past Meetings
          </button>
        </div>
      </div>

      {activeTab === "upcoming" ? (
        // Show NoMeetingData for upcoming tab if no meetings
        !hasUpcomingMeetings ? (
          <NoData2 />
        ) : (
          <div className="space-y-6">
            {groupedMeetings.today.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Today, {getTodayString()}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMeetings.today.map((meeting) => (
                    <MeetingCard
                      key={meeting._id}
                      meeting={meeting}
                      isPast={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedMeetings.tomorrow.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Tomorrow, {getTomorrowString()}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMeetings.tomorrow.map((meeting) => (
                    <MeetingCard
                      key={meeting._id}
                      meeting={meeting}
                      isPast={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedMeetings.nextWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Next Week</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMeetings.nextWeek.map((meeting) => (
                    <MeetingCard
                      key={meeting._id}
                      meeting={meeting}
                      isPast={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedMeetings.upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMeetings.upcoming.map((meeting) => (
                    <MeetingCard
                      key={meeting._id}
                      meeting={meeting}
                      isPast={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        // Show NoMeetingData for past tab if no meetings
        groupedMeetings.past.length === 0 ? (
          <NoData2 />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedMeetings.past.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} isPast={true} />
            ))}
          </div>
        )
      )}
    </div>
  );
}