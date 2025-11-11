import { useEffect, useState } from "react";
import ExpertProfileInSchedule from "./ExpertProfileInSchedule";
import Calendar from "./components/Calendar/Calendar";
import TimeSlots from "./TimeSlots/TimeSlots";
import "./Scheduling.css";
import { useDispatch, useSelector } from "react-redux";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { verifyRescheduleToken } from "@/Redux/Slices/meetingSlice";
import { useParams } from "react-router-dom";
import TimeSlotsforReschedule from "./TimeSlots/TimeSlotforReschedule";
import Spinner from "@/components/LoadingSkeleton/Spinner";

function ReScheduling() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fetchedData, setFetchedData] = useState(false); // ✅ Prevents infinite loop

  const [retryCount, setRetryCount] = useState(0);
  const { rescheduleData } = useSelector((state) => state.meeting);
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
  const userData = JSON.parse(data);
  const expertToken = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!fetchedData && retryCount < 5) {
          // ✅ Allow up to 5 attempts
          // console.log(`Fetching attempt ${retryCount + 1}...`);

          const res = await dispatch(
            verifyRescheduleToken(expertToken.updatemeetingtoken)
          ).unwrap();

          if (res.success && rescheduleData) {
            const serviceId = rescheduleData.serviceId;
            const expertId = rescheduleData.expert._id;

            if (expertId) {
              await dispatch(getServicebyid({ serviceId, expertId })).unwrap();
              await dispatch(getAvailabilitybyid(expertId)).unwrap();
            }
            setFetchedData(true); // ✅ Data fetched successfully
          } else {
            setRetryCount((prev) => prev + 1); // ❌ Retry if no success
          }
        }
      } catch (error) {
        console.error(
          `Error fetching data on attempt ${retryCount + 1}:`,
          error
        );
        setRetryCount((prev) => prev + 1); // ❌ Retry on error
      }
    };

    fetchData();
  }, [dispatch, expertToken, fetchedData, retryCount]); // ✅ Runs on retry count update

  if (expertLoading || availabilityLoading) {
    return <Spinner />;
  }

  if (expertError || availabilityError) {
    return (
      <p className="text-red-500">Error: {expertError || availabilityError}</p>
    );
  }

  if (!rescheduleData?.expert || !selectedAvailability?.availability) {
    return (
      <p>
        Expert or Availability data is not available. Please try again later.
      </p>
    );
  }

  const expert = {
    image:
      rescheduleData.expert.credentials?.portfolio?.[0]?.photo?.secure_url ||
      "https://via.placeholder.com/100",
    name: rescheduleData.expert.firstName + " " + selectedExpert.lastName,
    title: rescheduleData.expert.credentials?.domain || "No Title Provided",
    sessionDuration: selectedService?.duration,
    price: selectedService?.price,
    description: selectedService?.detailedDescription,
    includes: selectedService?.features,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:grid lg:grid-cols-[minmax(320px,400px),1fr] gap-6 lg:gap-8">
        <ExpertProfileInSchedule expert={expert} />

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Schedule Your Session</h2>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <TimeSlotsforReschedule
            token={expertToken}
            sessionDuration={selectedService?.duration}
            selectedDate={selectedDate}
            selectedAvailability={selectedAvailability}
            expertName={
              selectedExpert.firstName + " " + selectedExpert.lastName
            }
            userName={userData.firstName + " " + userData.lastName}
            serviceName={selectedService?.title}
            expertId={selectedExpert?._id}
            serviceId={selectedService?.serviceId}
          />
        </div>
      </div>
    </div>
  );
}

export default ReScheduling;
