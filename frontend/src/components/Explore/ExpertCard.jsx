import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Star, Heart, BadgeCheck } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
// import { addFavorite, removeFavorite } from "../Dashboard/User/Favourites/userService";
import { addFavourites, fetchUserProfile } from "@/Redux/Slices/authSlice";
import toast from "react-hot-toast";

const ExpertCard = ({
  redirect_url,
  id,
  name,
  image,
  title,
  rating,
  totalRatings,
  experience,
  startingPrice,
  duration,
  expertise,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  let userData;
  try {
    userData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing user data:", error);
    userData = null;
  }
  useEffect(() => {
    if (userData?.favourites) {
      // Check if expert ID exists in the user's favorites
      setIsFavorite(userData.favourites.some((expert) => expert._id === id));
    }
  }, [userData, id]);
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(id)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, id]);

  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const handleFavoriteClick = async () => {
    try {
      await dispatch(addFavourites({ expertId: id }));
      await dispatch(fetchUserProfile()); // Fetch updated user data

      setIsFavorite((prev) => !prev);

      // 🎉 Show toast notification (top-right corner)
      toast.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!",
        {
          position: "top-right",
          autoClose: 3000, // Closes after 3 seconds
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
                src={image}
                alt={name}
                className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[18px] sm:text-[21.3px] font-semibold text-[#1d1d1d] font-['Figtree',Helvetica] leading-[1.4] sm:leading-[29.8px] truncate">
                      {name}
                    </h2>
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0000FF] flex-shrink-0" />
                  </div>
                  <p className="text-[14px] sm:text-[15.5px] text-[#1d1f1d] opacity-80 font-['Figtree',Helvetica] leading-[1.4] sm:leading-[23.2px] mb-2">
                    {title}
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
                        {totalRatings} Sessions done
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <p className="font-['Figtree',Helvetica] text-[14px] sm:text-[15.5px] leading-[1.4] sm:leading-[23.2px]">
                      <span className="text-[#1d1d1d]">Experience: </span>
                      <span className="font-medium text-[#1d1d1d]">
                        {experience} in industry
                      </span>
                    </p>
                    <p className="font-['Figtree',Helvetica] text-[14px] sm:text-[15.5px] leading-[1.4] sm:leading-[23.2px]">
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
                {expertise.slice(0, 2).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[13px] sm:text-[15px] rounded-[8.03px] px-2 sm:px-[11px] py-[1px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                {expertise.slice(2).map((skill, index) => (
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
                {firstAvailableDay
                  ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                  : "No slots available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/expert/${redirect_url}`)}
                className="h-[32px] sm:h-[35px] rounded-[11.04px] px-3 sm:px-4 bg-white border border-gray-200 shadow-[0px_2.45px_6.13px_2.15px_#0000001a] font-medium text-[13px] sm:text-[14.5px] text-[#000000cc] hover:bg-gray-50 whitespace-nowrap"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  navigate(`/expert/${redirect_url}?scrollTo=services-offered`);
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
