import { useEffect, useState } from "react";
import DashboardLayout from "./components/layout/DashboardLayout";
import MeetingsTable from "./components/meetings/MeetingsTable";
import TodaysMeetings from "./components/meetings/TodaysMeetings";
import SearchBar from "./components/search/SearchBar";
import FilterDropdown from "./components/filters/FilterDropdown";
import JoinMeetingModal from "./components/modals/JoinMeetingModal";
import MeetingsHeader from "./components/meetings/MeetingsHeader";
import MeetingsTabs from "./components/meetings/MeetingsTabs";
import { useSearch } from "./hooks/useSearch";
import { useMeetingsFilter } from "./hooks/useMeetingsFilter";
import UpcomingMeetingDetails from "./components/meetings/details/UpcomingMeetingDetails";
import PastMeetingDetails from "./components/meetings/details/PastMeetingDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  addvideoparticipant,
  getMeetingByExpertId,
} from "@/Redux/Slices/meetingSlice";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  extractMeetingStatus,
  getMeetingStatusLabel,
} from "@/utils/meetingStatus";

const to24HourTime = (timeString = "") => {
  const trimmed = timeString.trim();
  if (!trimmed) {
    return null;
  }

  const [timePart, periodPart] = trimmed.split(/\s+/);
  if (!timePart) {
    return null;
  }

  const [rawHours, rawMinutes = "00"] = timePart.split(":");
  const minutesPart = rawMinutes.includes(":") ? rawMinutes.split(":")[0] : rawMinutes;
  const minutes = minutesPart.padStart(2, "0");

  let hours = Number(rawHours);
  if (Number.isNaN(hours)) {
    return null;
  }

  const period = periodPart ? periodPart.toUpperCase() : null;
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const getMeetingEndTimestamp = (meeting) => {
  const meetingDateString = meeting?.daySpecific?.date;
  if (!meetingDateString) {
    return 0;
  }

  const baseDate = new Date(meetingDateString);
  if (Number.isNaN(baseDate.getTime())) {
    return 0;
  }

  const endTimeString =
    meeting?.daySpecific?.slot?.endTime || meeting?.daySpecific?.slot?.startTime;
  const time24 = to24HourTime(endTimeString);

  if (!time24) {
    return baseDate.getTime();
  }

  const datePart = baseDate.toISOString().split("T")[0];
  const combined = new Date(`${datePart}T${time24}:00`);
  const timestamp = combined.getTime();

  return Number.isNaN(timestamp) ? baseDate.getTime() : timestamp;
};

const getMeetingStartTimestamp = (meeting) => {
  const meetingDateString = meeting?.daySpecific?.date;
  if (!meetingDateString) {
    return 0;
  }

  const baseDate = new Date(meetingDateString);
  if (Number.isNaN(baseDate.getTime())) {
    return 0;
  }

  const startTimeString = meeting?.daySpecific?.slot?.startTime;
  const time24 = to24HourTime(startTimeString);

  if (!time24) {
    return baseDate.getTime();
  }

  const datePart = baseDate.toISOString().split("T")[0];
  const combined = new Date(`${datePart}T${time24}:00`);
  const timestamp = combined.getTime();

  return Number.isNaN(timestamp) ? baseDate.getTime() : timestamp;
};

function Meetings() {
  const { meetings } = useSelector((state) => state.meeting);
  const [joinMeetingModal, setJoinMeetingModal] = useState({
    isOpen: false,
    meeting: null,
  });
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filter, setFilter] = useState("All");
  const [joinedMeetingId, setJoinedMeetingId] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false); // New state to track meeting status
  const { expertData } = useSelector((state) => state.expert);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMeetingByExpertId());
  }, [dispatch]);

  const today = dayjs().format("YYYY-MM-DD");

  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);

  // Assign sessionStatus dynamically based on backend status updates
  const categorizedMeetings = paidMeetings.map((meeting) => {
    const normalizedStatus = extractMeetingStatus(meeting);
    return {
      ...meeting,
      sessionStatus: getMeetingStatusLabel(meeting),
      normalizedStatus,
    };
  });

  const todaysMeetings = categorizedMeetings
    .filter((meeting) => meeting.daySpecific.date === today)
    .sort(
      (a, b) => getMeetingStartTimestamp(a) - getMeetingStartTimestamp(b)
    );
  console.log("Todays", todaysMeetings);
  const upcomingMeetings = categorizedMeetings
    .filter((meeting) => meeting.daySpecific.date > today)
    .sort(
      (a, b) => getMeetingStartTimestamp(a) - getMeetingStartTimestamp(b)
    );
  console.log("upcoming", upcomingMeetings);
  const pastMeetings = categorizedMeetings
    .filter((meeting) => meeting.daySpecific.date < today)
    .sort(
      (a, b) => getMeetingEndTimestamp(b) - getMeetingEndTimestamp(a)
    );
  console.log("past", pastMeetings);

  // Select meetings based on activeTab
  let selectedMeetings = [];
  if (activeTab === "upcoming") selectedMeetings = upcomingMeetings;
  else if (activeTab === "past") selectedMeetings = pastMeetings;
  else selectedMeetings = categorizedMeetings;
  console.log("selectedMeetings before search", selectedMeetings);

  const { searchQuery, handleSearch, filteredItems } = useSearch(
    selectedMeetings,
    ["userName", "serviceName"]
  );
  const { filteredMeetings } = useMeetingsFilter(
    filteredItems,
    filter,
    searchQuery,
    activeTab
  );
  console.log("filtered item", filteredItems);
  console.log("filtered meeting", filteredMeetings);
  const handleStartMeeting = async (meeting) => {
    // setJoinMeetingModal({ isOpen: true, meeting });
    try {
      console.log("This is expert video call id", meeting.videoCallId);
      const meetingId = meeting.videoCallId;
      const startTime = meeting.daySpecific.slot.startTime
      const endTime = meeting.daySpecific.slot.endTime
      const joinCallData = {
        meeting_id: meeting.videoCallId,
        custom_participant_id: meeting.expertId,
        name: expertData.firstName + " " + expertData.lastName,
        preset_name: "group_call_host",
      };

      console.log("Preset Name being sent:", joinCallData.preset_name);

      const response = await dispatch(
        addvideoparticipant(joinCallData)
      ).unwrap();
      console.log("This is response", response);

      if (response?.data?.data?.token) {
        const authToken = response.data.data.token;
        console.log("Auth Token received:", authToken);
        console.log("meetinng id received:", meetingId);

        // Set both states to enable polling
        setJoinedMeetingId(meeting.videoCallId);
        setIsInMeeting(true);

        // Navigate to meeting page with authToken
        navigate("/meeting", { state: { authToken, meetingId, startTime, endTime } });
      } else {
        console.error("Failed to retrieve authToken.");
        toast.error("Failed to join the meeting", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Error joining the meeting", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleViewDetails = (meeting) => {
    setSelectedMeeting(meeting);
  };

  if (selectedMeeting) {
    return selectedMeeting.daySpecific.date < today ? (
      <PastMeetingDetails
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
      />
    ) : (
      <UpcomingMeetingDetails
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
      />
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Meetings Dashboard
      </h1>
      <div className="mt-8">
        <TodaysMeetings
          meetings={todaysMeetings}
          onStartMeeting={handleStartMeeting}
          onViewDetails={handleViewDetails}
        />
      </div>
      <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <MeetingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search meetings..."
          />
          <FilterDropdown onFilterChange={setFilter} />
        </div>
      </div>
      <div className="mt-6">
        <MeetingsHeader activeTab={activeTab} />
        <MeetingsTable
          meetings={filteredMeetings}
          onViewDetails={handleViewDetails}
          activeTab={activeTab}
        />
      </div>
      <JoinMeetingModal
        isOpen={joinMeetingModal.isOpen}
        onClose={() => setJoinMeetingModal({ isOpen: false, meeting: null })}
        meeting={joinMeetingModal.meeting}
      />
    </DashboardLayout>
  );
}

export default Meetings;
