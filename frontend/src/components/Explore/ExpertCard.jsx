import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Star } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { optimisticAdd, optimisticRemove, toggleFavourite, selectFavouriteIds, selectIsUpdatingFavourite } from "@/Redux/Slices/favouritesSlice";
import toast from "react-hot-toast";

const ExpertCard = (props) => {
  const {
    redirect_url,
    id,
    _id, // if parent passes _id
    name,
    image,
    title,
    rating,
    totalRatings,
    experience,
    startingPrice,
    duration,
    expertise = [], // ensure array
    verified = false, // default to false if not provided
  } = props;

  const expertId = _id || id; // normalize
  const dispatch = useDispatch();
  const favIds = useSelector(selectFavouriteIds);
  const isUpdating = useSelector(s => selectIsUpdatingFavourite(s, expertId));
  const isFav = expertId ? favIds.includes(expertId) : false;

  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();

  // Fetch availability once
  useEffect(() => {
    if (!expertId) return;
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expertId)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
    fetchAvailability();
  }, [dispatch, expertId]);

  const getFirstAvailableSlot = () => {
    if (!availability?.daySpecific) {
      return { day: null, time: null };
    }

    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeString) => {
      const [time, period] = timeString.split(/(\s?[AP]M)/i);
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      
      if (period && period.toUpperCase().includes('PM') && hours !== 12) {
        hour24 += 12;
      } else if (period && period.toUpperCase().includes('AM') && hours === 12) {
        hour24 = 0;
      }
      
      return hour24 * 60 + minutes;
    };

    // Check today's slots first
    const todayData = availability.daySpecific.find(day => day.day === currentDay);
    
    if (todayData && todayData.slots && todayData.slots.length > 0) {
      for (const slot of todayData.slots) {
        if (!slot.startTime || !slot.endTime) continue;

        const slotStartMinutes = parseTime(slot.startTime);
        const slotEndMinutes = parseTime(slot.endTime);
        const sessionDuration = duration || 30;
        
        let currentSlotTime = slotStartMinutes;
        
        while (currentSlotTime + sessionDuration <= slotEndMinutes) {
          if (currentSlotTime > currentTimeMinutes + 30) {
            const nextAvailableHour = Math.floor(currentSlotTime / 60);
            const nextAvailableMinute = currentSlotTime % 60;
            const nextAvailableTime = `${nextAvailableHour > 12 ? nextAvailableHour - 12 : nextAvailableHour === 0 ? 12 : nextAvailableHour}:${nextAvailableMinute.toString().padStart(2, '0')} ${nextAvailableHour >= 12 ? 'PM' : 'AM'}`;
            
            return { day: "Today", time: nextAvailableTime };
          }
          currentSlotTime += 15;
        }
      }
    }

    // Check future days if no today slots
    for (const dayData of availability.daySpecific) {
      if (dayData.day === currentDay) continue;
      
      if (!dayData.slots || dayData.slots.length === 0) continue;

      for (const slot of dayData.slots) {
        if (!slot.startTime) continue;
        return { day: dayData.day, time: slot.startTime };
      }
    }

    return { day: null, time: null };
  };

  const { day: firstAvailableDay, time: firstAvailableTime } = getFirstAvailableSlot();

  const [pulse, setPulse] = useState(false);

  const handleFav = (e) => {
    e.stopPropagation();
    if (!expertId || isUpdating) return;
    setPulse(true);

    const wasFav = isFav;

    if (wasFav) dispatch(optimisticRemove(expertId));
    else dispatch(optimisticAdd(expertId));

    dispatch(toggleFavourite(expertId)).then((r) => {
      if (r.meta.requestStatus === "fulfilled") {
        const act = r.payload.action;
        toast.success(
          act === "added" ? "Added to favourites" : "Removed from favourites",
          { position: "top-right" }
        );
      } else {
        // rollback using snapshot
        if (wasFav) dispatch(optimisticAdd(expertId));
        else dispatch(optimisticRemove(expertId));
        toast.error("Failed to update favourite", { position: "top-right" });
      }
    });
  };


  const profilePath = `/expert/${redirect_url || expertId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ 
        y: -2, 
        boxShadow: "0px 8px 25px rgba(22, 149, 68, 0.15)",
        transition: { duration: 0.2 } 
      }}
      className="w-full h-full sm:max-w-screen-md bg-[#fdfdfd] rounded-xl p-3 sm:p-5 border-2 border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440] cursor-pointer"
    >
      <div className="flex flex-col h-full">
        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Top Section */}
          <div className="flex items-start gap-3 sm:gap-4 relative">
            <motion.div 
              className="py-1 sm:py-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                onClick={() => navigate(profilePath)}
                src={image}
                alt={name}
                className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 
                    onClick={() => navigate(profilePath)}
                    className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-gray-900 leading-tight break-words">
                      {name}
                    </h2>
                    {verified === true && (
                      <img src="/svg-image-65.svg" alt="verified tick" className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-base text-gray-700 opacity-90 mb-2 line-clamp-1">
                    {title}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-xs sm:text-sm md:text-sm lg:text-sm text-gray-800">
                        {rating}/5
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex gap-1 sm:gap-2 items-center bg-emerald-50 text-gray-800 rounded-full px-2 sm:px-2 py-1 text-xs sm:text-xs md:text-sm font-medium">
                        <User className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        {totalRatings} Sessions done
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1 z-0">
                    <p className="text-sm sm:text-sm md:text-base lg:text-base">
                      <span className="text-gray-800">Experience: </span>
                      <span className="font-medium text-gray-900">
                        {experience} years in industry
                      </span>
                    </p>
                    <p className="text-sm sm:text-sm md:text-base lg:text-base">
                      <span className="text-gray-700">Starts at </span>
                      <span className="font-semibold text-blue-600">
                        Rs. {startingPrice}
                      </span>
                      <span className="text-gray-700"> for </span>
                      <span className="font-semibold text-blue-600">
                        {duration} min
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFav}
                  disabled={isUpdating}
                  className="absolute right-0 top-0 disabled:opacity-40 flex items-center justify-center w-8 h-8"
                  aria-label="toggle favourite"
                  aria-pressed={isFav}
                >
                  <motion.span
                    initial={false}
                    animate={pulse ? { scale: [1, 1.35, 0.85, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    onAnimationComplete={() => setPulse(false)}
                    className="flex"
                  >
                    {isFav ? (
                      <FaHeart className={`w-5 h-5 sm:w-6 sm:h-6 text-red-500 ${isUpdating ? "animate-pulse" : ""}`} />
                    ) : (
                      <FaRegHeart className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 ${isUpdating ? "animate-pulse" : ""}`} />
                    )}
                  </motion.span>
                  {isUpdating && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-200/40" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="w-full">
            <div className="line-clamp-2 min-h-[3rem]">
              <span className="text-sm sm:text-sm md:text-base lg:text-base text-gray-800 mr-2 ">Expertise:</span>
              {expertise.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex bg-gray-100 text-gray-800 text-xs sm:text-xs md:text-sm lg:text-sm rounded-lg px-2 sm:px-2 md:px-3 py-1 mr-1.5 mb-1.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          </div>

        {/* Bottom Section */}
        <div className="mt-3 sm:mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-row items-center justify-between w-full gap-3">
            <div className="flex flex-col flex-shrink-0">
              <span className="font-medium text-xs sm:text-sm md:text-sm lg:text-sm text-gray-800">
                Next Available Slot:
              </span>
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-blue-700 font-medium">
                {firstAvailableDay && firstAvailableTime
                  ? (() => {
                      const now = new Date();
                      const currentDay = now.toLocaleString("en-US", { weekday: "long" });
                      const isToday = firstAvailableDay === currentDay;
                      return `${isToday ? "Today" : firstAvailableDay}, ${firstAvailableTime}`;
                    })()
                  : "No slots available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => navigate(profilePath)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
                className=" h-8 sm:h-9 px-3 sm:px-3 md:px-4 bg-white border border-gray-300 shadow-sm font-semibold tracking-tight rounded-lg text-xs sm:text-sm md:text-base hover:bg-gray-50"
              >
                View Profile
              </motion.button>
              <motion.button
                onClick={() =>
                  navigate(`${profilePath}?scrollTo=services-offered`)
                }
                whileHover={{ scale: 1.05, backgroundColor: "rgb(209 250 229)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className=" h-8 sm:h-9 px-3 sm:px-3 md:px-4 bg-emerald-50 text-emerald-600 font-semibold tracking-tight text-xs sm:text-sm md:text-base shadow-sm rounded-lg hover:bg-emerald-100"
              >
                Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertCard;