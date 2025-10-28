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
import { useDispatch, useSelector } from "react-redux";
import {
  getMeetingByExpertId,
  getfeedbackbyexpertid,
} from "@/Redux/Slices/meetingSlice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { getmeasexpert } from "@/Redux/Slices/expert.Slice";
// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";

function Home() {
  const dispatch = useDispatch();
  const { expertData, loading, error } = useSelector((state) => state.expert);
  const { meetings, feedbackofexpert } = useSelector((state) => state.meeting);
  const { selectedAvailability } = useSelector((state) => state.availability);

  console.log("🏠 Expert Home component rendered");
  console.log("availabilty", selectedAvailability);
  const availability = selectedAvailability?.availability;

  useEffect(() => {
    dispatch(getmeasexpert());
  }, [dispatch]);
  useEffect(() => {
    if (expertData?._id) {
      const fetchInitialData = async () => {
        await dispatch(getMeetingByExpertId());
        dispatch(getAvailabilitybyid(expertData._id));
        dispatch(getfeedbackbyexpertid(expertData._id));
      };
      fetchInitialData();
    }
  }, [dispatch, expertData?._id]);

  // useEffect(() => {
  //   const fetchMeetings = async () => {
  //     const response = await dispatch(getMeetingByExpertId());
  //     if (response?.payload?.success) {
  //       dispatch(getAvailabilitybyid(expertData._id));
  //     }
  //   };
  //   fetchMeetings();
  // }, [dispatch]);

  // useEffect(()=>{
  //   dispatch(getfeedbackbyexpertid(expertData._id))
  // },[dispatch])

  // Check if expert has set availability
  const hasAvailability = availability?.daySpecific?.some((day) =>
    day.slots?.some((slot) => slot.startTime)
  );

  const oneOnOneService = expertData?.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const hasEditedOneOnOneService = oneOnOneService?.one_on_one?.some(
    (session) => session.price > 0
  );
  // Check if expert has added at least one service
  const hasServices = expertData?.credentials?.services?.length > 0;

  // Check if expert has filled domain, niche, and professionalTitle
  const hasExpertBasics =
    expertData?.credentials?.domain &&
    expertData?.credentials?.niche?.length > 0 &&
    expertData?.credentials?.professionalTitle?.length > 0;

  const hasPaymentDetails = expertData?.credentials?.PaymentDetails?.length > 0;
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
    {
      id: 4,
      icon: "edit",
      text: "Edit your One-on-One Service",
      completed: hasEditedOneOnOneService,
    },
    // {
    //   id: 5,
    //   icon: "payment", // Use an appropriate icon
    //   text: "Update your Payment Details",
    //   completed: hasPaymentDetails, // True if PaymentDetails is not empty
    // },
  ];

  // Filter out actions that are already completed
  const pendingActions = actionsNeeded.filter((action) => !action.completed);

  if (loading) {
    return <Spinner />;
  }
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

  // Process meetings data for different components
  const paidMeetings = meetings?.filter((meeting) => meeting.isPayed) || [];

  // For earnings calculation - simplified data
  const earningsData = paidMeetings.map(({ amount, daySpecific }) => ({
    amount: Number(amount),
    date: daySpecific?.date || "Unknown Date",
    status: "Paid",
  }));

  const totalEarnings =
    earningsData?.reduce((sum, meeting) => sum + meeting.amount, 0) || 0;

  // const earningsData = {
  //   totalEarnings: 45000,
  //   earnings: [
  //     {
  //       amount: 15000,
  //       date: "Today",
  //       status: "Paid",
  //     },
  //     {
  //       amount: 12000,
  //       date: "Yesterday",
  //       status: "Paid",
  //     },
  //     {
  //       amount: 18000,
  //       date: "Jan 13, 2024",
  //       status: "Pending",
  //     },
  //   ],
  // };

  const calculateCompletion = (data, availability) => {
    if (!data) return { percentage: 0, firstIncompleteSection: 'basic' };

    // Define required fields for each section with their weights
    const sections = {
      basic: {
        fields: [
          "firstName",
          "lastName",
          "bio",
          "gender",
          "dateOfBirth",
          "nationality",
          "city",
          "mobile",
          "email",
          "languages",
        ],
        weight: 17, // Using integers to avoid floating point issues
      },
      expertise: {
        fields: [
          "domain",
          "niche",
          "professionalTitle",
          "skills",
        ],
        weight: 17,
      },
      experience: {
        fields: ["work_experiences"],
        weight: 17,
      },
      education: {
        fields: ["education"],
        weight: 17,
      },
      certifications: {
        fields: ["certifications_courses"],
        weight: 17,
      },
      services: {
        fields: ["services"],
        weight: 7, // 7% for services
      },
      availability: {
        fields: ["availability"],
        weight: 7, // 7% for availability
      },
    };

    let totalPercentage = 0;
    let firstIncompleteSection = null;
    let debugInfo = {};

    // Check basic section
    const basicComplete = sections.basic.fields.every(field => {
      const value = data[field];
      if (Array.isArray(value)) return value.length > 0;
      return value && String(value).trim() !== '';
    });

    // Check expertise section
    const expertiseComplete = sections.expertise.fields.every(field => {
      if (data.credentials) {
        const value = data.credentials[field];
        if (Array.isArray(value)) return value.length > 0;
        return value && String(value).trim() !== '';
      }
      return false;
    });

    // Check experience section
    const experienceComplete = data.credentials?.work_experiences?.length > 0;

    // Check education section
    const educationComplete = data.credentials?.education?.length > 0;

    // Check certifications section
    const certificationsComplete = data.credentials?.certifications_courses?.length > 0;

    // Check if all profile sections are complete (basic, expertise, experience, education, certifications)
    const profileSectionsComplete = basicComplete && expertiseComplete && experienceComplete && educationComplete && certificationsComplete;

    if (profileSectionsComplete) {
      totalPercentage += 86; // 86% for completing all profile sections
      debugInfo.profile = true;
    }

    // Check services section
    const servicesComplete = data.credentials?.services?.length > 0;
    if (servicesComplete) {
      totalPercentage += 7; // 7% for services
      debugInfo.services = true;
    }

    // Check availability section
    const availabilityComplete = availability?.daySpecific?.some((day) =>
      day.slots?.some((slot) => slot.startTime)
    );
    if (availabilityComplete) {
      totalPercentage += 7; // 7% for availability
      debugInfo.availability = true;
    }

    // Find first incomplete section
    if (!basicComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'basic';
    } else if (!expertiseComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'expertise';
    } else if (!experienceComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'experience';
    } else if (!educationComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'education';
    } else if (!certificationsComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'certifications';
    } else if (!servicesComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'expertise'; // Services are part of expertise tab
    } else if (!availabilityComplete && firstIncompleteSection === null) {
      firstIncompleteSection = 'basic'; // Availability might be handled separately, default to basic
    }

    // If all sections are complete, default to basic
    if (firstIncompleteSection === null) {
      firstIncompleteSection = 'basic';
    }

    // Round to nearest integer
    const percentage = Math.round(totalPercentage);

    return {
      percentage,
      firstIncompleteSection
    };
  };

  const { percentage: completionPercentage, firstIncompleteSection } = calculateCompletion(expertData, availability);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto p-4 lg:p-8">
        <Header pendingActions={pendingActions} />

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
            <AvailabilityCalendar meetings={paidMeetings} />
            {/* <PerformanceChart /> */}
          </div>
          <div className="space-y-4">
            {expertData && availability && (
              <CompleteProfile
                completion={completionPercentage}
                firstIncompleteSection={firstIncompleteSection}
              />
            )}
            {/* <RecentEarnings
              totalEarnings={earningsData.totalEarnings}
              earnings={earningsData.earnings}
            /> */}
            <RecentEarnings
              totalEarnings={totalEarnings}
              earnings={earningsData}
            />
            <ClientFeedback feedback={feedbackofexpert || []} />
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
