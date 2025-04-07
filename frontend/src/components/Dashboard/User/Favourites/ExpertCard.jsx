import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Star, Heart, BadgeCheck, Clock } from "lucide-react";
import { addFavourites, fetchUserProfile } from "@/Redux/Slices/authSlice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import toast from "react-hot-toast";

const ExpertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    if (expert?.isFavorite) {
      setIsFavorite(true);
    }
  }, [expert]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expert._id)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, expert._id]);

  // Get the first enabled slot from one-on-one services
  const firstEnabledSlot = expert.credentials?.services?.[0]?.one_on_one?.find(
    slot => slot.enabled === true
  );

  // Get starting price and duration from the first enabled slot
  const startingPrice = firstEnabledSlot?.price || 0;
  const duration = firstEnabledSlot?.duration || "N/A";

  // Find the first available day and time slot
  const firstAvailableDay = availability?.daySpecific?.find(
    day => day.slots && day.slots.length > 0
  );

  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  // Calculate rating
  const rating = expert.reviews?.length > 0
    ? Math.round(
        expert.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        ) / expert.reviews.length
      )
    : 0;

  // Get total sessions/ratings
  const totalSessions = expert.sessions?.length || 0;

  const handleFavoriteClick = async () => {
    try {
      await dispatch(addFavourites({ expertId: expert._id }));
      await dispatch(fetchUserProfile());

      setIsFavorite((prev) => !prev);

      toast.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error updating favorite", error);
      toast.error("Something went wrong!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-full max-w-[502px] bg-[#fdfdfd] rounded-[9.81px] p-3 sm:p-5 border-[1.23px] border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440] mx-auto">
      <div className="flex flex-col h-full">
        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Top Section */}
          <div className="flex items-start gap-3 sm:gap-4 relative">
            <div className="py-1 sm:py-2">
              <img
                src={
                  expert?.profileImage?.secure_url ||
                  "https://via.placeholder.com/100"
                }
                alt={`${expert.firstName} ${expert.lastName}photo`}
                className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[18px] sm:text-[21.3px] font-semibold text-[#1d1d1d] font-['Figtree',Helvetica] leading-[1.4] sm:leading-[29.8px] truncate">
                      {expert.firstName} {expert.lastName}
                    </h2>
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0000FF] flex-shrink-0" />
                  </div>
                  <p className="text-[14px] sm:text-[15.5px] text-[#1d1f1d] opacity-80 font-['Figtree',Helvetica] leading-[1.4] sm:leading-[23.2px] mb-2">
                    {expert.credentials?.professionalTitle?.[0]}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-yellow-400 fill-yellow-400" />
                      <span className="font-['Figtree',Helvetica] font-medium text-[13px] sm:text-[14.5px] text-[#1d1f1d] leading-[1.4] sm:leading-[21.7px]">
                        {rating}/5
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex gap-1 sm:gap-2 items-center bg-[#c4f3d34c] text-[#1d1f1d] rounded-[24.16px] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[10.6px] leading-[1.4] sm:leading-[15.9px] font-medium">
                        <User className="w-3 h-3 sm:w-[12.57px] sm:h-[12.57px]" />
                        {totalSessions} Sessions done
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <p className="font-['Figtree',Helvetica] text-[14px] sm:text-[15.5px] leading-[1.4] sm:leading-[23.2px]">
                      <span className="text-[#1d1d1d]">Experience: </span>
                      <span className="font-medium text-[#1d1d1d]">
                        {expert.credentials?.experienceYears} in industry
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-['Figtree',Helvetica] text-[14px] sm:text-[15.5px] leading-[1.4] sm:leading-[23.2px]">
                        <span className="text-[#000000e6]">Starts at </span>
                        <span className="font-medium text-[#0049b3]">
                          Rs. {startingPrice}
                        </span>
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[#000000e6]"> for </span>
                        <span className="font-medium text-[#0049b3]">
                          {duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFavoriteClick}
                  className={`absolute right-0 top-0 ${
                    isAnimating ? "animate-ping" : ""
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
                      isAnimating ? "scale-125" : ""
                    }`}
                    fill={isFavorite ? "#EF4444" : "none"}
                    stroke={isFavorite ? "#EF4444" : "currentColor"}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="w-full">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="font-['Figtree',Helvetica] text-[14px] sm:text-[15px] text-[#1d1f1d]">
                  Expertise:
                </span>
                {expert.credentials?.skills?.slice(0, 2).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[13px] sm:text-[15px] rounded-[8.03px] px-2 sm:px-[11px] py-[1px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                {expert.credentials?.skills?.slice(2).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[13px] sm:text-[15px] rounded-[8.03px] px-2 sm:px-[11px] py-[1px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Always at the bottom */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-row items-center justify-between w-full gap-3">
            <div className="flex flex-col flex-shrink-0">
              <span className="font-['Figtree',Helvetica] font-medium text-[13px] sm:text-[14.5px] text-[#1d1f1d] leading-[1.4] sm:leading-[21.7px]">
                Next Available Slot:
              </span>
              <span className="font-['Figtree',Helvetica] text-[13px] sm:text-[14.5px] text-[#1f409b] leading-[1.4] sm:leading-[21.7px]">
                {firstAvailableDay && firstAvailableTime
                  ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                  : "No slots available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/expert/${expert.redirect_url}`)}
                className="h-[32px] sm:h-[35px] rounded-[11.04px] px-3 sm:px-4 bg-white border border-gray-200 shadow-[0px_2.45px_6.13px_2.15px_#0000001a] font-medium text-[13px] sm:text-[14.5px] text-[#000000cc] hover:bg-gray-50 whitespace-nowrap"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  navigate(`/expert/${expert.redirect_url}?scrollTo=services-offered`);
                }}
                className="h-[32px] sm:h-[34px] rounded-[11.04px] px-3 sm:px-4 bg-[#edfbf1] text-[#169544] font-semibold text-[13px] sm:text-[14.5px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] hover:bg-[#ddf9e5] whitespace-nowrap"
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