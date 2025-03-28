import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Star, Heart, BadgeCheck } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";

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
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const toggleLike = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="w-full md:w-[502px] bg-[#fdfdfd] rounded-[9.81px] p-5 border-[1.23px] border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440]">
      <div className="flex flex-col h-full min-h-[300px]">
        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-[10px]">
          {/* Top Section */}
          <div className="flex items-start gap-4 relative">
            <div className="py-2.5">
              <img
                src={image}
                alt={name}
                className="w-[110px] h-[110px] rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[21.3px] font-semibold text-[#1d1d1d] font-['Figtree',Helvetica] leading-[29.8px] truncate">
                      {name}
                    </h2>
                    <BadgeCheck className="w-5 h-5 text-[#0000FF] flex-shrink-0" />
                    
                  </div>
                  <p className="text-[15.5px] text-[#1d1f1d] opacity-80 font-['Figtree',Helvetica] leading-[23.2px]">
                    {title}
                  </p>

                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-[18px] h-[18px] text-yellow-400 fill-yellow-400" />
                      <span className="font-['Figtree',Helvetica] font-medium text-[14.5px] text-[#1d1f1d] leading-[21.7px]">
                        {rating}/5
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex gap-2 items-center bg-[#c4f3d34c] text-[#1d1f1d] rounded-[24.16px] px-2.5 py-0.5 text-[10.6px] leading-[15.9px] font-medium">
                        <User className="w-[12.57px] h-[12.57px]" />
                        {totalRatings} Sessions done
                      </span>
                    </div>


                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <p className="font-['Figtree',Helvetica] text-[15.5px] leading-[23.2px]">
                      <span className="text-[#1d1d1d]">Experience: </span>
                      <span className="font-medium text-[#1d1d1d]">
                        {experience} in industry
                      </span>
                    </p>
                    <p className="font-['Figtree',Helvetica] text-[15.5px] leading-[23.2px]">
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
                  onClick={toggleLike}
                  className={`absolute right-0 top-0 ${isAnimating ? "animate-ping" : ""}`}
                >
                  <Heart
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isAnimating ? "scale-125" : ""
                    }`}
                    fill={liked ? "#EF4444" : "none"}
                    stroke={liked ? "#EF4444" : "currentColor"}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="w-full">
            <div className="flex flex-col ">
              <div className="flex items-center ">
                <span className="font-['Figtree',Helvetica] text-[15px] text-[#1d1f1d]">
                  Expertise:
                </span>
                <div className="flex flex-wrap gap-2">
                  {expertise.slice(0, 2).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[15px] rounded-[8.03px] px-[11px] py-[1px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertise.slice(2).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[15px] rounded-[8.03px] px-[11px] py-[1px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Always at the bottom */}
        <div className="mt-1 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="font-['Figtree',Helvetica] font-medium text-[14.5px] text-[#1d1f1d] leading-[21.7px]">
                Next Available Slot:
              </span>
              <span className="font-['Figtree',Helvetica] text-[14.5px] text-[#1f409b] leading-[21.7px]">
                {firstAvailableDay
                  ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                  : "No slots available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/expert/${redirect_url}`)}
                className="h-[35px] rounded-[11.04px] px-4 bg-white border border-gray-200 shadow-[0px_2.45px_6.13px_2.15px_#0000001a] font-medium text-[14.5px] text-[#000000cc] hover:bg-gray-50"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  navigate(`/expert/${redirect_url}?scrollTo=services-offered`);
                }}
                className="h-[34px] rounded-[11.04px] px-4 bg-[#edfbf1] text-[#169544] font-semibold text-[14.5px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] hover:bg-[#ddf9e5]"
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