import { useEffect, useState } from "react";
import ExpertProfileInSchedule from "./ExpertProfileInSchedule";
import Calendar from "./components/Calendar/Calendar";
import TimeSlots from "./TimeSlots/TimeSlots";
import "./Scheduling.css";
import { useDispatch, useSelector } from "react-redux";
import { getServiceWithExpertByServiceId } from "@/Redux/Slices/expert.Slice"; // ✅ fix
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import Footer from "@/components/Home/components/Footer";
import Navbar from "@/components/Home/components/Navbar";
import SearchModal from "@/components/Home/components/SearchModal";
import { ArrowLeft } from "lucide-react";

function Scheduling() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const { serviceId } = useParams(); // ✅ grab serviceId from URL
  const { duration, price } = location.state || {};

  // console.log("[Scheduling] URL params - serviceId:", serviceId);
  // console.log("[Scheduling] Location state:", location.state);
  // console.log("[Scheduling] Duration:", duration, "Price:", price);

  const {
    selectedExpert,
    loading: expertLoading,
    error: expertError,
    selectedService,
  } = useSelector((state) => state.expert);

  const {
    selectedAvailability,
    loading: availabilityLoading,
    error: availabilityError,
  } = useSelector((state) => state.availability);

  const { data } = useSelector((state) => state.auth);

  let userData;
  try {
    userData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("[Scheduling] Error parsing user data:", error);
  }

  // 🧠 Fetch expert + service by serviceId
  useEffect(() => {
    if (!selectedExpert && serviceId) {
      dispatch(getServiceWithExpertByServiceId(serviceId)).then((res) => {
        console.log("[Scheduling] Fetched expert + service:", res?.payload);
      });
    }
  }, [dispatch, selectedExpert, serviceId]);

  // 🎯 Fetch availability after expert is loaded
  useEffect(() => {
    if (selectedExpert?._id && !availabilityLoading) {
      dispatch(getAvailabilitybyid(selectedExpert._id));
    }
  }, [dispatch, selectedExpert]);

  useEffect(() => {
    if (!selectedExpert && serviceId) {
      dispatch(getServiceWithExpertByServiceId(serviceId)).then((res) => {
        console.log("Fetched expert + service:", res?.payload);
      });
    }
  }, [dispatch, selectedExpert, serviceId]);

  useEffect(() => {
    if (selectedExpert?._id && !availabilityLoading) {
      dispatch(getAvailabilitybyid(selectedExpert._id));
    }
  }, [dispatch, selectedExpert]);

  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  //gurdev
  // const sessionDuration = duration || selectedService?.duration;
  // const sessionPrice = price || selectedService?.price;

  const defaultSlot = selectedService?.one_on_one?.find(slot => slot.enabled);
  const sessionDuration = duration || defaultSlot?.duration || 30;
  const sessionPrice = price || defaultSlot?.price || 100;


  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  // ⏳ Loading state
  if (expertLoading || availabilityLoading) {
    return <Spinner />;
  }

  // ❌ Error state
  if (expertError || availabilityError) {
    return (
      <p className="text-red-500">Error: {expertError || availabilityError}</p>
    );
  }

  // ⚠️ Not ready yet
  if (!selectedExpert || !selectedService || !selectedAvailability?.availability) {
    return (
      <p className="text-yellow-600">
        Expert or service data not available. Please try again later.
      </p>
    );
  }

  // 🧩 Data mapping
  const expert = {
    image: selectedExpert.profileImage?.secure_url || "https://via.placeholder.com/100",
    name: selectedExpert.firstName + " " + selectedExpert.lastName,
    title: Array.isArray(selectedExpert.credentials?.professionalTitle) 
      ? selectedExpert.credentials?.professionalTitle[0] || "No Title Provided"
      : selectedExpert.credentials?.professionalTitle || "No Title Provided",
    sessionDuration,
    price: sessionPrice,
    description: selectedService.detailedDescription || "No description provided",
    includes: selectedService.features || [],
  };

  // 📊 COMPREHENSIVE DATA LOG - All Scheduling Data in One Place
  console.log("=== [SCHEDULING COMPLETE DATA] ===", {
    "URL & Navigation": {
      serviceId,
      locationState: location.state,
      duration,
      price,
    },
    "Redux State": {
      selectedExpert,
      selectedService,
      selectedAvailability,
      expertLoading,
      availabilityLoading,
      expertError,
      availabilityError,
    },
    "User Data": userData,
    "Calculated Values": {
      defaultSlot,
      sessionDuration,
      sessionPrice,
    },
    "Professional Title": {
      raw: selectedExpert?.credentials?.professionalTitle,
      isArray: Array.isArray(selectedExpert?.credentials?.professionalTitle),
      processed: expert.title,
    },
    "Final Expert Object": expert,
    "Component Ready": !!(selectedExpert && selectedService && selectedAvailability?.availability),
  });

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
        onToggleExpertMode={handleToggle}
      />

      <main className="flex-grow py-8 sm:py-12 lg:py-16 mt-2">
        <div className="max-w-[1440px] mx-auto mt-0 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-6 p-2 rounded-lg hover:bg-green-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Previous Page</span>
          </button>

          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(300px,400px),1fr] gap-6 lg:gap-8">
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                  Schedule Your Session
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-6">
                  <div className="w-full max-w-[350px]">
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      availability={selectedAvailability}
                    />
                  </div>
                  <div>
                    <TimeSlots
                      triggerAuthPopup={() => console.log('Auth popup triggered')}
                      sessionDuration={sessionDuration}
                      sessionPrice={sessionPrice}
                      selectedDate={selectedDate}
                      selectedAvailability={selectedAvailability}
                      expertName={
                        selectedExpert.firstName +
                        " " +
                        selectedExpert.lastName
                      }
                      userName={
                        userData?.firstName + " " + userData?.lastName
                      }
                      serviceName={selectedService.title}
                      expertId={selectedExpert._id}
                      serviceId={selectedService.serviceId}
                      serviceDescription={selectedService.detailedDescription}
                      includes={selectedService.features}
                      title={selectedService.title}
                      setIsModalOpen={setIsModalOpen}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-2 lg:order-1">
              <ExpertProfileInSchedule expert={expert} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySelect={handleModalCategorySelect}
      />
    </div>
  );
}

export default Scheduling;
