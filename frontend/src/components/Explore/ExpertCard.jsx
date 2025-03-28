import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Star, Heart } from "lucide-react";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
    <Card className="flex flex-col w-full md:w-[502px] items-start gap-[12px] p-5 bg-[#fdfdfd] rounded-[9.81px] border-[1.23px] border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440]">
      <CardContent className="relative self-stretch w-full h-full p-0">
        <div className="flex flex-col w-full items-start gap-4">
          {/* Profile header section */}
          <div className="relative self-stretch w-full">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex items-center py-2.5">
                <Avatar className="w-[110px] h-[110px]">
                  <AvatarImage src={image} alt={name} className="object-cover" />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              {/* Profile info */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-[21.3px] text-[#1d1d1d] font-['Figtree',Helvetica] leading-[29.8px]">
                  {name}
                </h2>

                <p className="opacity-80 font-['Figtree',Helvetica] text-[15.5px] text-[#1d1f1d] leading-[23.2px]">
                  {title}
                </p>

                <div className="flex items-center gap-3 mt-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-[18px] h-[18px] text-yellow-400 fill-yellow-400" />
                    <span className="font-['Figtree',Helvetica] font-medium text-[14.5px] text-[#1d1f1d] leading-[21.7px]">
                      {rating}/5
                    </span>
                  </div>

                  {/* Sessions badge */}
                  <Badge className="flex items-center gap-2 bg-[#c4f3d34c] text-[#1d1f1d] font-normal rounded-[24.16px] px-2.5 py-0.5">
                    <User className="w-[12.57px] h-[12.57px]" />
                    <span className="font-medium text-[10.6px] leading-[15.9px]">
                      {totalRatings} Sessions done
                    </span>
                  </Badge>
                </div>

                {/* Experience and pricing */}
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

              {/* Heart icon */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 p-0"
                onClick={toggleLike}
              >
                <Heart 
                  className={`w-6 h-6 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'} ${
                    isAnimating ? 'scale-125' : ''
                  } transition-transform duration-300`}
                />
              </Button>
            </div>
          </div>

          {/* Expertise section */}
          <div className="w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-['Figtree',Helvetica] text-[15px] text-[#1d1f1d]">
                  Expertise:
                </span>
                <div className="flex flex-wrap gap-2">
                  {expertise.slice(0, 2).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[15px] rounded-[8.03px] px-[11px] py-[1px]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {expertise.slice(2).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#f2f2f2] text-[#1d1f1d] font-normal text-[15px] rounded-[8.03px] px-[11px] py-[1px]"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer section */}
          <div className="flex items-center justify-between w-full mt-auto">
            {/* Next available slot */}
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

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/expert/${redirect_url}`)}
                className="h-[35px] rounded-[11.04px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] font-medium text-[14.5px] text-[#000000cc]"
              >
                View Profile
              </Button>
              <Button
                onClick={() => {
                  navigate(`/expert/${redirect_url}?scrollTo=services-offered`);
                }}
                className="h-[34px] rounded-[11.04px] bg-[#edfbf1] text-[#169544] font-semibold text-[14.5px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] hover:bg-[#ddf9e5]"
              >
                BOOK
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;