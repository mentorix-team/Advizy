import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import MeetingCard from "../Component/MeetingCard";
import { useDispatch, useSelector } from "react-redux";
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

  console.log("this is paid one", paidMeetings);

  useEffect(() => {
    try {
      dispatch(getMeetingByUserId());
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [dispatch]);

  // Group meetings into today, tomorrow, and next week
  const groupedMeetings = paidMeetings.reduce(
    (acc, meeting) => {
      const meetingDate = new Date(meeting.daySpecific.date).toDateString();
      const today = new Date().toDateString();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (meetingDate === today) {
        acc.today.push(meeting);
      } else if (meetingDate === tomorrow.toDateString()) {
        acc.tomorrow.push(meeting);
      } else {
        acc.nextWeek.push(meeting);
      }
      return acc;
    },
    { today: [], tomorrow: [], nextWeek: [] }
  );

  // Check if there are any meetings for the current tab
  const hasUpcomingMeetings =
    groupedMeetings.today.length > 0 ||
    groupedMeetings.tomorrow.length > 0 ||
    groupedMeetings.nextWeek.length > 0;

  const pastMeetings = paidMeetings.filter(
    (meeting) => new Date(meeting.daySpecific.date) < new Date()
  );

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
                      meeting={{
                        ...meeting,
                        date: formatDate(meeting.daySpecific.date),
                      }}
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
      pastMeetings.length === 0 ? (
        <NoData2 />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidMeetings
            .filter(
              (meeting) => new Date(meeting.daySpecific.date) < new Date()
            )
            .map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} isPast={true} />
            ))}
        </div>
      )
      )}
    </div>
  );
}
