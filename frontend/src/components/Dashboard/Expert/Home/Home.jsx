import React, { useEffect } from "react";
import Header from "./components/Header";
// import StatsCard from "./components/StatsCard";
import ActionNeeded from "./components/ActionNeeded";
import UpcomingSessions from "./components/UpcomingSessions";
// import PerformanceChart from "./components/PerformanceChart";
import CompleteProfile from "./components/CompleteProfile";
import RecentEarnings from "./components/RecentEarnings";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import ClientFeedback from "./components/ClientFeedback";
import RecommendedResources from "./components/RecommendedResources";
import { BiUser, BiCalendar, BiRupee, BiStar } from "react-icons/bi";
import { TwoPersonIcon } from "@/icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { getMeetingByExpertId } from "@/Redux/Slices/meetingSlice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

function Home() {
  const dispatch = useDispatch();
  const { expertData } = useSelector((state) => state.expert);
  const { meetings, loading, error } = useSelector((state) => state.meeting);
  const { selectedAvailability } = useSelector((state) => state.availability);

  console.log("availabilty", selectedAvailability);
  const availability = selectedAvailability?.availability;
  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await dispatch(getMeetingByExpertId());
      if (response?.payload?.success) {
        dispatch(getAvailabilitybyid(expertData._id));
      }
    };
    fetchMeetings();
  }, [dispatch]);

  // Check if expert has set availability
  const hasAvailability = availability?.daySpecific?.some((day) =>
    day.slots?.some((slot) => slot.startTime)
  );

  // Check if expert has added at least one service
  const hasServices = expertData?.credentials?.services?.length > 0;

  // Check if expert has filled domain, niche, and professionalTitle
  const hasExpertBasics =
    expertData?.credentials?.domain &&
    expertData?.credentials?.niche?.length > 0 &&
    expertData?.credentials?.professionalTitle?.length > 0;

  // Define actions needed based on the checks above
  const actionsNeeded = [
    {
      id: 1,
      icon: "message",
      text: "Add Your Expertise",
      completed: hasExpertBasics,
    },
    {
      id: 2,
      icon: "star",
      text: "Add Your Services",
      completed: hasServices,
    },
    {
      id: 3,
      icon: "calendar",
      text: "Set your Availability",
      completed: hasAvailability,
    },
  ];

  // Filter out actions that are already completed
  const pendingActions = actionsNeeded.filter((action) => !action.completed);

  // Rest of your code remains unchanged...
  const bookingsData = [
    {
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "60 min",
      client: "John Doe",
    },
    {
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "45 min",
      client: "Jane Smith",
    },
  ];

  const feedbackData = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent mentoring session! Very helpful and insightful.",
      avatar: null,
    },
    {
      name: "Mike Brown",
      rating: 4,
      comment: "Great advice on career development.",
      avatar: null,
    },
  ];

  const resourcesData = [
    {
      title: "Interview Preparation Guide",
      type: "Article",
      url: "https://docs.google.com/document/d/1yyiHmP9DCUMGdVUvRxIa28YkHL4y_4JU8ZHGWJf6YLA/edit?usp=sharing",
    },
    {
      title: "Technical Interview Basics",
      type: "Video",
      url: "https://docs.google.com/document/d/1KEUz9VXCvGabBPE9OM9au3_3RynU4fW8kmK4TauZr0w/edit?usp=sharing",
    },
    {
      title: "Career Development Handbook",
      type: "Ebook",
      url: "https://docs.google.com/document/d/16lZK-pDBivoEsehZI10o36kFg2iGnVo_-YcjbwTJRAI/edit?usp=sharing",
    },
  ];

  const handleViewResource = (url) => {
    if (url) {
      window.open(url, "_blank"); // Opens in a new tab
    }
  };

  const earningsData = {
    totalEarnings: 45000,
    earnings: [
      {
        amount: 15000,
        date: "Today",
        status: "Paid",
      },
      {
        amount: 12000,
        date: "Yesterday",
        status: "Paid",
      },
      {
        amount: 18000,
        date: "Jan 13, 2024",
        status: "Pending",
      },
    ],
  };

  const calculateCompletion = (data) => {
    if (!data) return 0;

    const sections = {
      basicInfo: [
        "firstName",
        "lastName",
        "gender",
        "dateOfBirth",
        "nationality",
        "country_living",
        "email",
        "mobile",
        "city",
        "languages",
        "bio",
        "socialLinks",
        "profileImage",
        "coverImage",
      ],
      credentials: [
        "domain",
        "niche",
        "professionalTitle",
        "skills",
        "work_experiences",
        "PaymentDetails",
        "education",
        "certifications_courses",
        "portfolio",
        "services",
      ],
    };

    let filledCount = 0;
    let totalFields = 0;

    Object.keys(sections).forEach((section) => {
      sections[section].forEach((field) => {
        if (data.credentials && sections.credentials.includes(field)) {
          if (Array.isArray(data.credentials[field])) {
            if (data.credentials[field].length > 0) filledCount++;
          } else if (data.credentials[field]) {
            filledCount++;
          }
        } else {
          if (Array.isArray(data[field])) {
            if (data[field].length > 0) filledCount++;
          } else if (data[field]) {
            filledCount++;
          }
        }
        totalFields++;
      });
    });

    return Math.round((filledCount / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion(expertData);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto p-4 lg:p-8">
        <Header />

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Sessions"
            value="48"
            change={12}
            icon={<BiCalendar size={24} className="text-[#169544]" />}
          />
          <StatsCard
            title="Active Mentees"
            value="24"
            change={8}
            icon={<TwoPersonIcon className="w-6 h-6" stroke="#169544" />}
          />
          <StatsCard
            title="Total Earnings"
            value="₹45,000"
            change={15}
            icon={<BiRupee size={24} className="text-[#169544]" />}
          />
          <StatsCard
            title="Average Rating"
            value="4.8"
            change={5}
            icon={<BiStar size={24} className="text-[#169544]" />}
          />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-[741px,332px] gap-4 auto-rows-auto">
          <div className="space-y-4">
            {/* Pass pendingActions to ActionNeeded component */}
            <ActionNeeded actions={pendingActions} />
            {bookingsData?.length > 0 && (
              <UpcomingSessions sessions={bookingsData} />
            )}
            <AvailabilityCalendar meetings={meetings} />
            {/* <PerformanceChart /> */}
          </div>
          <div className="space-y-4">
            <CompleteProfile completion={completionPercentage} />
            <RecentEarnings
              totalEarnings={earningsData.totalEarnings}
              earnings={earningsData.earnings}
            />
            <ClientFeedback feedback={feedbackData} />
            <RecommendedResources
              resources={resourcesData}
              onViewResource={handleViewResource}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
