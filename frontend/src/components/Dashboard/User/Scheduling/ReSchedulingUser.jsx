import { useEffect, useState } from 'react';
import ExpertProfileInSchedule from './ExpertProfileInSchedule';
import Calendar from './components/Calendar/Calendar';
import TimeSlots from './TimeSlots/TimeSlots';
import './Scheduling.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailabilitybyid } from '@/Redux/Slices/availability.slice';
import TimeSlotforRescheduleUser from './TimeSlots/TimeSlotforRescheduleUser';

function ReSchedulingUser() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { selectedExpert, loading: expertLoading, error: expertError ,selectedService} = useSelector((state) => state.expert); 
  const { selectedAvailability, loading: availabilityLoading, error: availabilityError } = useSelector((state) => state.availability);
  console.log("This is availability",selectedAvailability)
  const {data} = useSelector((state)=>state.auth)
  console.log("this is data",JSON.parse(data))
  const userData = JSON.parse(data)
  useEffect(() => {
    
    console.log("this is my expert ",selectedExpert)
    console.log("this is my Serice ",selectedService)
    if (selectedExpert._id && !availabilityLoading) {
      dispatch(getAvailabilitybyid(selectedExpert._id));
    }
  }, [dispatch, selectedExpert]);

  console.log("Selected Date:", selectedDate);
  console.log("Selected Availability:", selectedAvailability);

 
  if (expertLoading || availabilityLoading) {
    return <p>Loading expert and availability data...</p>;
  }

  if (expertError || availabilityError) {
    return <p className="text-red-500">Error: {expertError || availabilityError}</p>;
  }

  if (!selectedExpert || !selectedAvailability?.availability) {
    return <p>Expert or Availability data is not available. Please try again later.</p>;
  }

  const expert ={ 
    image:selectedExpert.credentials?.portfolio?.[0]?.photo?.secure_url || 'https://via.placeholder.com/100',
    name:selectedExpert.firstName+" "+selectedExpert.lastName,
    title:selectedExpert.credentials?.domain || 'No Title Provided',
    sessionDuration:selectedService.duration,
    price:selectedService.price,
    description:selectedService.detailedDescription,
    includes:selectedService.features
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:grid lg:grid-cols-[minmax(320px,400px),1fr] gap-6 lg:gap-8">
        <ExpertProfileInSchedule
          expert ={expert}
        />

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Schedule Your Session</h2>
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          <TimeSlotforRescheduleUser
             sessionDuration={selectedService.duration}
             selectedDate={selectedDate} 
             selectedAvailability={selectedAvailability}
             expertName = {selectedExpert.firstName+" "+selectedExpert.lastName}
             userName= {userData.firstName + " "+userData.lastName}
             serviceName = {selectedService.title}
             expertId={selectedExpert._id} 
             serviceId={selectedService.serviceId} 
          />

        </div>
      </div>
    </div>
  );
}

export default ReSchedulingUser;
