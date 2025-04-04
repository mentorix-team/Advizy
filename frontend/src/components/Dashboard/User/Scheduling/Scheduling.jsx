import { useEffect, useState } from 'react';
import ExpertProfileInSchedule from './ExpertProfileInSchedule';
import Calendar from './components/Calendar/Calendar';
import TimeSlots from './TimeSlots/TimeSlots';
import './Scheduling.css';
import { useDispatch, useSelector } from 'react-redux';
import { getExpertById } from '@/Redux/Slices/expert.Slice';
import { getAvailabilitybyid } from '@/Redux/Slices/availability.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '@/components/LoadingSkeleton/Spinner';
import Footer from '@/components/Home/components/Footer';
import Navbar from '@/components/Home/components/Navbar';
import SearchModal from '@/components/Home/components/SearchModal';
import { ArrowLeft } from 'lucide-react';

function Scheduling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const { duration, price } = location.state || {};

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
    console.error("Error parsing data:", error);
  }

  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  useEffect(() => {
    if (selectedExpert._id && !availabilityLoading) {
      dispatch(getAvailabilitybyid(selectedExpert._id));
    }
  }, [dispatch, selectedExpert]);

  const sessionDuration = duration || selectedService?.duration;
  const sessionPrice = price || selectedService?.price;

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  if (expertLoading || availabilityLoading) {
    return <Spinner />;
  }

  if (expertError || availabilityError) {
    return (
      <p className="text-red-500">Error: {expertError || availabilityError}</p>
    );
  }

  if (!selectedExpert || !selectedAvailability?.availability) {
    return (
      <p>Expert or Availability data is not available. Please try again later.</p>
    );
  }

  const expert = {
    image: selectedExpert.profileImage?.secure_url || 'https://via.placeholder.com/100',
    name: selectedExpert.firstName + " " + selectedExpert.lastName,
    title:selectedExpert.credentials?.professionalTitle || 'No Title Provided',
    sessionDuration,
    price: sessionPrice,
    description: selectedService.detailedDescription,
    includes: selectedService.features
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
        onToggleExpertMode={handleToggle}
      />
      
      <main className="flex-grow py-8 sm:py-12 lg:py-16 mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-6 p-2 rounded-lg hover:bg-green-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Previous Page</span>
          </button>

          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(300px,400px),1fr] gap-6 lg:gap-8">
            {/* Schedule Section - Appears first on mobile */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Schedule Your Session</h2>
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
                    sessionDuration={sessionDuration}
                    sessionPrice={sessionPrice}
                    selectedDate={selectedDate} 
                    selectedAvailability={selectedAvailability}
                    expertName = {selectedExpert.firstName+" "+selectedExpert.lastName}
                    userName= {userData.firstName + " "+userData.lastName}
                    serviceName = {selectedService.title}
                    expertId={selectedExpert._id} 
                    serviceId={selectedService.serviceId} 
                    serviceDescription = {selectedService.detailedDescription}
                    includes = {selectedService.features}
                    title = {selectedService.title}
                  />
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Profile Section - Appears second on mobile */}
            <div className="order-2 lg:order-1">
              <ExpertProfileInSchedule expert={expert} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Scheduling;