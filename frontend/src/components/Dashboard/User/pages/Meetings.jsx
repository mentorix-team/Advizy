import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import MeetingCard from "../Component/MeetingCard";
import { getMeetingByUserId } from "@/Redux/Slices/meetingSlice";
import NoData2 from "@/NoData2";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import MeetingDetail from "./MeetingDetail";

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
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { meetings } = useSelector((state) => state.meeting);
  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);

  useEffect(() => {
    try {
      dispatch(getMeetingByUserId());
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [dispatch]);

  // Group meetings into today, tomorrow, next week, upcoming, and past
  const groupedMeetings = paidMeetings.reduce(
    (acc, meeting) => {
      try {
        if (!meeting.daySpecific || !meeting.daySpecific.date || !meeting.daySpecific.slot) {
          console.warn("Invalid meeting format:", meeting);
          return acc;
        }

        const now = dayjs();
        const meetingDate = dayjs(meeting.daySpecific.date).startOf('day');
        const meetingEnd = dayjs(`${meeting.daySpecific.date} ${meeting.daySpecific.slot.endTime}`, 'YYYY-MM-DD hh:mm A');

        // Check if meeting is in the past
        if (meetingEnd.isBefore(now)) {
          acc.past.push(meeting);
          return acc;
        }

        // Check if meeting is today
        const isToday = meetingDate.isSame(now, 'day');
        if (isToday) {
          acc.today.push(meeting);
          return acc;
        }

        // Check if meeting is tomorrow
        const tomorrow = now.add(1, 'day').startOf('day');
        const isTomorrow = meetingDate.isSame(tomorrow, 'day');
        if (isTomorrow) {
          acc.tomorrow.push(meeting);
          return acc;
        }

        // Check if meeting is in the next 7 days
        const nextWeek = now.add(7, 'day').startOf('day');
        if (meetingDate.isAfter(tomorrow) && meetingDate.isSameOrBefore(nextWeek)) {
          acc.nextWeek.push(meeting);
          return acc;
        }

        // All other future meetings
        acc.upcoming.push(meeting);
        return acc;
      } catch (error) {
        console.error("Error processing meeting:", error, meeting);
        return acc;
      }
    },
    { today: [], tomorrow: [], nextWeek: [], upcoming: [], past: [] }
  );

  // Check if there are any upcoming meetings
  const hasUpcomingMeetings =
    groupedMeetings.today.length > 0 ||
    groupedMeetings.tomorrow.length > 0 ||
    groupedMeetings.nextWeek.length > 0 ||
    groupedMeetings.upcoming.length > 0;

  const [refreshing, setRefreshing] = useState(false);

  const refreshMeetings = async () => {
    setRefreshing(true);
    try {
      await dispatch(getMeetingByUserId());
      toast.success("Meetings refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh meetings");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    dispatch(getMeetingByUserId());

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      dispatch(getMeetingByUserId());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleViewDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedMeeting(null);
  };

  // If we're showing details, render the MeetingDetail component
  if (showDetails && selectedMeeting) {
    return (
      <MeetingDetail 
        meeting={selectedMeeting} 
        isPast={activeTab === "past"} 
        onBack={handleBackToList} 
      />
    );
  }

  // Otherwise, render the meetings list
  return (
    <div className="p-8">
      <div className="flex w-fit items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <button
          onClick={refreshMeetings}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
          title="refresh meeting details"
        >
          {refreshing ? "..." : <RefreshCw className="w-4 h-4 text-black" />}
        </button>
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        groupedMeetings.past.length === 0 ? (
          <NoData2 />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedMeetings.past.map((meeting) => (
              <MeetingCard 
                key={meeting._id} 
                meeting={meeting} 
                isPast={true} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}