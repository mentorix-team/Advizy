import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

const expertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mentoringService = expert.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const firstEnabledSlot = mentoringService?.one_on_one?.find(
    (slot) => slot.enabled
  );

  const startingPrice = firstEnabledSlot?.price || 0;
  const duration = firstEnabledSlot?.duration || "N/A";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expert.id)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    if (expert.id) {
      fetchAvailability();
    }
  }, [dispatch, expert.id]);

  // Function to get the next available time slot from day-specific availability
  const getLatestAvailableSlot = () => {
    if (!availability?.daySpecific || !Array.isArray(availability.daySpecific)) {
      return { day: null, time: null };
    }

    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper function to parse time string to minutes
    const parseTime = (timeString) => {
      if (!timeString) return 0;
      try {
        const [time, period] = timeString.split(/(\s?[AP]M)/i);
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        
        if (period && period.toUpperCase().includes('PM') && hours !== 12) {
          hour24 += 12;
        } else if (period && period.toUpperCase().includes('AM') && hours === 12) {
          hour24 = 0;
        }
        
        return hour24 * 60 + minutes;
      } catch (err) {
        return 0;
      }
    };

    // Helper function to format minutes back to readable time
    const formatTime = (minutes) => {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      return `${hour12}:${min.toString().padStart(2, '0')} ${period}`;
    };

    // Check today's slots first
    const todayData = availability.daySpecific.find(day => day.day === currentDay);
    
    if (todayData && todayData.slots && todayData.slots.length > 0) {
      let earliestAvailableTime = null;
      const bufferTime = currentTimeMinutes + 30; // 30 min buffer from current time
      
      for (const slot of todayData.slots) {
        if (!slot.startTime || !slot.endTime) continue;

        const slotStartMinutes = parseTime(slot.startTime);
        const slotEndMinutes = parseTime(slot.endTime);
        const sessionDuration = parseInt(duration) || 30;
        
        if (slotEndMinutes > bufferTime && (slotEndMinutes - slotStartMinutes) >= sessionDuration) {
          const earliestPossibleStart = Math.max(slotStartMinutes, bufferTime);
          const latestPossibleStart = slotEndMinutes - sessionDuration;
          
          if (earliestPossibleStart <= latestPossibleStart) {
            if (!earliestAvailableTime || earliestPossibleStart < earliestAvailableTime) {
              earliestAvailableTime = earliestPossibleStart;
            }
          }
        }
      }
      
      if (earliestAvailableTime) {
        return { day: "Today", time: formatTime(earliestAvailableTime) };
      }
    }

    // Check future days for next available slots
    for (const dayData of availability.daySpecific) {
      if (dayData.day === currentDay) continue;
      
      if (!dayData.slots || dayData.slots.length === 0) continue;

      for (const slot of dayData.slots) {
        if (!slot.startTime || !slot.endTime) continue;
        
        const slotStartMinutes = parseTime(slot.startTime);
        const slotEndMinutes = parseTime(slot.endTime);
        const sessionDuration = parseInt(duration) || 30;
        
        if ((slotEndMinutes - slotStartMinutes) >= sessionDuration) {
          return { day: dayData.day, time: slot.startTime };
        }
      }
    }

    return { day: null, time: null };
  };

  const { day: latestAvailableDay, time: latestAvailableTime } = getLatestAvailableSlot();

  const averageRating =
    expert.reviews?.length > 0
      ? (
          expert.reviews.reduce((acc, review) => acc + review.rating, 0) /
          expert.reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        y: 0,
      }}
      transition={{ duration: 0.5 }}
      className="flex flex-row justify-center w-full"
    >
      <div className="w-[289px] mx-auto mt-[41px] bg-neutral-50 rounded-lg shadow-md border border-solid border-[#00000040] p-5">
        <div className="flex flex-col items-center">
          <div className="py-2.5">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
              <img
                onClick={() => navigate(`/expert/${expert.redirect_url}`)}
                src={
                  expert.image ||
                  "https://via.placeholder.com/100"
                }
                alt={`${expert.name}`}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-[1.22px] mt-6">
            <Star className="w-[14.64px] h-[14.64px] text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-black text-[13.4px] leading-[20.1px] font-['Figtree']">
              {averageRating}
            </span>
            <span className="font-medium text-gray-700 text-[9.8px] leading-[14.6px] font-['Figtree']">
              ({expert.reviews || 0} reviews)
            </span>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
            <div className="flex items-center gap-2">
              <h3 onClick={() => navigate(`/expert/${expert.redirect_url}`)} className=" cursor-pointer font-['Figtree'] font-semibold text-[#1d1f1d] text-xl leading-7">
                {`${expert.name}`}
              </h3>
              {expert.admin_approved_expert && (
                <img src="/svg-image-65.svg" alt="verified tick" />
              )}
            </div>
            <p className="opacity-80 font-['Figtree'] font-normal text-black text-base text-center leading-6 min-h-[48px] line-clamp-3">
              {expert.title || "experts"}
            </p>
          </div>

          <div className="flex w-full items-center justify-between mt-6">
            <div className="flex flex-col">
              <span className="font-['Figtree'] font-medium text-[#1d1f1d] text-xs leading-[18px]">
                Next Available Slot:
              </span>
              <span className="font-['Figtree'] font-normal text-[#1f409b] text-xs leading-[18px]">
                {latestAvailableDay
                  ? `${latestAvailableDay}, ${latestAvailableTime}`
                  : "No slots available"}
              </span>
            </div>

            
            <motion.button
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
              className="h-[27px] bg-neutral-50 rounded-[9px] border border-[#00000040] shadow-[0px_2px_5px_1.75px_#0000001a] px-3 font-['Figtree'] font-medium text-[#1d1d1fcc] text-[15px]"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#169344",
                color: "#ffffff",
                borderColor: "#169344",
                boxShadow: "0px 4px 15px rgba(31, 64, 155, 0.3)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              initial={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                View Profile
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default expertCard;