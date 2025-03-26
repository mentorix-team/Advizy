import { useEffect, useState } from 'react';
import ExpertProfileInSchedule from './ExpertProfileInSchedule';
import Calendar from './components/Calendar/Calendar';
import TimeSlots from './TimeSlots/TimeSlots';
import './Scheduling.css';
import { useDispatch, useSelector } from 'react-redux';
import { getExpertById } from '@/Redux/Slices/expert.Slice';
import { getAvailabilitybyid } from '@/Redux/Slices/availability.slice';
import { useLocation } from 'react-router-dom';
import Spinner from '@/components/LoadingSkeleton/Spinner';
import Footer from '@/components/Home/components/Footer';
import Navbar from '@/components/Home/components/Navbar';
import SearchModal from '@/components/Home/components/SearchModal';

function Scheduling() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const { duration, price } = location.state || {};

  const { selectedExpert, loading: expertLoading, error: expertError, selectedService } = useSelector((state) => state.expert);
  const { selectedAvailability, loading: availabilityLoading, error: availabilityError } = useSelector((state) => state.availability);
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
    return <p className="text-red-500">Error: {expertError || availabilityError}</p>;
  }

  if (!selectedExpert || !selectedAvailability?.availability) {
    return <p>Expert or Availability data is not available. Please try again later.</p>;
  }

  const expert = {
    image: selectedExpert.credentials?.portfolio?.[0]?.photo?.secure_url || 'https://via.placeholder.com/100',
    name: selectedExpert.firstName + " " + selectedExpert.lastName,
    title: selectedExpert.credentials?.domain || 'No Title Provided',
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
      
      <main className="flex-grow py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Calendar Section - Shows first on mobile */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Schedule Your Session</h2>
                <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                <TimeSlots
                  sessionDuration={sessionDuration}
                  sessionPrice={sessionPrice}
                  selectedDate={selectedDate}
                  selectedAvailability={selectedAvailability}
                  expertName={selectedExpert.firstName + " " + selectedExpert.lastName}
                  userName={userData.firstName + " " + userData.lastName}
                  serviceName={selectedService.title}
                  expertId={selectedExpert._id}
                  serviceId={selectedService.serviceId}
                />
              </div>
            </div>

            {/* Expert Profile - Shows second on mobile */}
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