import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Star, Heart } from "lucide-react";
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

  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots?.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const truncateByChar = (text = "", maxChars) => {
    if (!text) return "";
    if (text.length <= maxChars) return text;
    let truncated = text.slice(0, maxChars);
    if (text[maxChars] !== " ") {
      truncated = truncated.slice(0, truncated.lastIndexOf(" "));
    }
    return truncated + "...";
  };

  const [pulse, setPulse] = useState(false); // trigger one-shot animation

  const handleFav = (e) => {
    e.stopPropagation();
    if (!expertId || isUpdating) return;
    setPulse(true);

    const wasFav = isFav; // snapshot the value at click time

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
        // rollback using snapshot, not current isFav
        if (wasFav) dispatch(optimisticAdd(expertId));
        else dispatch(optimisticRemove(expertId));
        toast.error("Failed to update favourite", { position: "top-right" });
      }
    });
  };


  const profilePath = `/expert/${redirect_url || expertId}`;

  return (
    <div
      className="w-full h-full sm:max-w-[502px] bg-[#fdfdfd] rounded-[9.81px] p-3 sm:p-5 border-[1.23px] border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440] mx-auto"
    >
      <div className="flex flex-col h-full">
        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Top Section */}
          <div className="flex items-start gap-3 sm:gap-4 relative">
            <div className="py-1 sm:py-2">
              <img
                src={image}
                alt={name}
                className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[18px] sm:text-[21.3px] font-semibold text-[#1d1d1d] leading-[1.4] sm:leading-[29.8px] break-words">
                      {name}
                    </h2>
                    {verified === true && (
                      <img src="/svg-image-65.svg" alt="verified tick" className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-[14px] sm:text-[15.5px] text-[#1d1f1d] opacity-80 mb-2">
                    {truncateByChar(title, 36)}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-[13px] sm:text-[14.5px] text-[#1d1f1d]">
                        {rating}/5
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex gap-1 sm:gap-2 items-center bg-[#c4f3d34c] text-[#1d1f1d] rounded-[24.16px] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[10.6px] font-medium">
                        <User className="w-3 h-3 sm:w-[12.57px] sm:h-[12.57px]" />
                        {totalRatings} Sessions done
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1 z-0">
                    <p className="text-[14px] sm:text-[15.5px]">
                      <span className="text-[#1d1d1d]">Experience: </span>
                      <span className="font-medium text-[#1d1d1d]">
                        {experience} years in industry
                      </span>
                    </p>
                    <p className="text-[14px] sm:text-[15.5px]">
                      <span className="text-[#000000e6]">Starts at </span>
                      <span className="font-medium text-[#0049b3]">
                        Rs. {startingPrice}
                      </span>
                      <span className="text-[#000000e6]"> for </span>
                      <span className="font-medium text-[#0049b3]">
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

          {/* Expertise Tags */}
          <div className="w-full">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="text-[14px] sm:text-[15px] text-[#1d1f1d]">
                  Expertise:
                </span>
                {expertise.slice(0, 5).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-[#f2f2f2] text-[#1d1f1d] text-[13px] sm:text-[15px] rounded-[8.03px] px-2 sm:px-[11px] py-[1px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-row items-center justify-between w-full gap-3">
            <div className="flex flex-col flex-shrink-0">
              <span className="font-medium text-[13px] sm:text-[14.5px] text-[#1d1f1d]">
                Next Available Slot:
              </span>
              <span className="text-[13px] sm:text-[14.5px] text-[#1f409b]">
                {firstAvailableDay && firstAvailableTime
                  ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                  : "No slots available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(profilePath)}
                className="h-[32px] sm:h-[35px] rounded-[11.04px] px-3 sm:px-4 bg-white border border-gray-200 shadow text-[13px] sm:text-[14.5px] hover:bg-gray-50 whitespace-nowrap"
              >
                View Profile
              </button>
              <button
                onClick={() =>
                  navigate(`${profilePath}?scrollTo=services-offered`)
                }
                className="h-[32px] sm:h-[34px] rounded-[11.04px] px-3 sm:px-4 bg-[#edfbf1] text-[#169544] font-semibold text-[13px] sm:text-[14.5px] shadow hover:bg-[#ddf9e5] whitespace-nowrap"
              >
                BOOK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;